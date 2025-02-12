"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useModels } from "@/app/(dashboard)/models/_hooks/useModels"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Card, CardContent } from "@package/ui/card"
import { Typography } from "@package/ui/typography"
import { Button } from "@package/ui/button"
import Image from "next/image"
import { useState, useEffect } from "react"
import { toast } from "@package/ui/toast"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"
import { demoDeployments } from "../../_hooks/useDeployments"

const deploymentFormSchema = z.object({
  modelId: z.string().min(1, "Please select a model"),
  provider: z.enum(["aws", "gcp", "azure"]),
  instanceType: z.string().min(1, "Please select an instance type"),
  deploymentType: z.enum(["simple", "canary"]),
  canaryConfig: z
    .object({
      trafficPercentage: z.number().min(0).max(100).optional(),
      steps: z.number().min(1).max(10).optional(),
      interval: z.number().min(1).optional(),
    })
    .optional(),
  kserveConfig: z
    .object({
      minReplicas: z.number().min(1).max(10).default(1),
      maxReplicas: z.number().min(1).max(20).default(3),
      scaleTargetUtilization: z.number().min(1).max(100).default(70),
      timeout: z.number().min(1).max(300).default(60),
      resources: z.object({
        requests: z.object({
          cpu: z.string(),
          memory: z.string(),
        }),
        limits: z.object({
          cpu: z.string(),
          memory: z.string(),
        }),
      }),
    })
    .optional(),
})

type DeploymentFormValues = z.infer<typeof deploymentFormSchema>

const cloudProviders = [
  {
    id: "aws",
    name: "Amazon Web Services",
    logo: "/logos/aws.svg",
    instances: [
      { id: "t2.medium", name: "t2.medium (2 vCPU, 4 GB RAM)" },
      { id: "t2.large", name: "t2.large (2 vCPU, 8 GB RAM)" },
      { id: "t2.xlarge", name: "t2.xlarge (4 vCPU, 16 GB RAM)" },
    ],
  },
  {
    id: "gcp",
    name: "Google Cloud Platform",
    logo: "/logos/gcp.svg",
    instances: [
      { id: "e2-standard-2", name: "e2-standard-2 (2 vCPU, 8 GB RAM)" },
      { id: "e2-standard-4", name: "e2-standard-4 (4 vCPU, 16 GB RAM)" },
      { id: "e2-standard-8", name: "e2-standard-8 (8 vCPU, 32 GB RAM)" },
    ],
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    logo: "/logos/azure.svg",
    instances: [
      { id: "Standard_D2s_v3", name: "D2s v3 (2 vCPU, 8 GB RAM)" },
      { id: "Standard_D4s_v3", name: "D4s v3 (4 vCPU, 16 GB RAM)" },
      { id: "Standard_D8s_v3", name: "D8s v3 (8 vCPU, 32 GB RAM)" },
    ],
  },
]

export function DeploymentForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { models } = useModels({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { width, height } = useWindowSize()
  const [showConfetti, setShowConfetti] = useState(false)

  const form = useForm<DeploymentFormValues>({
    resolver: zodResolver(deploymentFormSchema),
    defaultValues: {
      modelId: searchParams.get("modelId") || "",
      provider: "aws",
      instanceType: "",
      deploymentType: "simple",
      canaryConfig: {
        trafficPercentage: 20,
        steps: 5,
        interval: 10,
      },
      kserveConfig: {
        minReplicas: 1,
        maxReplicas: 3,
        scaleTargetUtilization: 70,
        timeout: 60,
        resources: {
          requests: {
            cpu: "500m",
            memory: "1Gi",
          },
          limits: {
            cpu: "2",
            memory: "4Gi",
          },
        },
      },
    },
  })

  const selectedProvider = cloudProviders.find(
    (provider) => provider.id === form.watch("provider")
  )

  async function onSubmit(data: DeploymentFormValues) {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const model = models.find((m) => m.id === data.modelId)

    // Create demo deployment
    const newDeployment = {
      id: `deployment-${Math.random().toString(36).slice(2, 9)}`,
      modelId: data.modelId,
      instanceType: data.instanceType,
      provider: data.provider,
      deploymentType: data.deploymentType,
      canaryConfig:
        data.deploymentType === "canary" ? data.canaryConfig : undefined,
      spec: {
        predictor: {
          minReplicas: data.kserveConfig?.minReplicas,
          maxReplicas: data.kserveConfig?.maxReplicas,
          scaleTargetUtilization: data.kserveConfig?.scaleTargetUtilization,
          timeout: data.kserveConfig?.timeout,
          model: {
            modelFormat: model?.deploymentConfig?.runtime,
            name: model?.name,
            version: model?.versions?.[0]?.version,
            resources: data.kserveConfig?.resources,
          },
        },
      },
      status: {
        status: "STATUS_ALL_COMPONENTS_READY",
        url: `https://api.deployo.ai/v1/models/${data.modelId}/predict`,
        canaryStatus:
          data.deploymentType === "canary"
            ? {
                currentStep: 1,
                totalSteps: data.canaryConfig?.steps,
                trafficPercentage: data.canaryConfig?.trafficPercentage,
              }
            : undefined,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save to localStorage while preserving existing deployments
    const existingDeployments = JSON.parse(
      localStorage.getItem("deployments") || "[]"
    )

    // If this is the first user deployment, include demo deployments
    const deploymentsToSave =
      existingDeployments.length === 0
        ? [...demoDeployments, newDeployment]
        : [...existingDeployments, newDeployment]

    localStorage.setItem("deployments", JSON.stringify(deploymentsToSave))

    console.log("Created deployment:", newDeployment)
    setShowConfetti(true)

    toast({
      title: "Deployment created successfully",
      description: "Your model is ready to use.",
      variant: "default",
    })

    setTimeout(() => {
      setShowConfetti(false)
      router.push("/deployments")
      router.refresh()
    }, 2500)
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="modelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model to deploy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id || ""} value={model.id || ""}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <Typography variant="h4">Deployment Strategy</Typography>
            <FormField
              control={form.control}
              name="deploymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deployment Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deployment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="simple">Simple Deployment</SelectItem>
                      <SelectItem value="canary">Canary Deployment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("deploymentType") === "canary" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="canaryConfig.trafficPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Traffic Percentage</FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canaryConfig.steps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Steps</FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canaryConfig.interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Step Interval (minutes)</FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          min="1"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Typography variant="h4">Infrastructure</Typography>

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cloud Provider</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cloudProviders.map((provider) => (
                      <Card
                        key={provider.id}
                        className={`cursor-pointer transition-colors hover:bg-accent ${
                          field.value === provider.id ? "border-primary" : ""
                        }`}
                        onClick={() => field.onChange(provider.id)}
                      >
                        <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                          <div className="h-12 flex items-center">
                            <Image
                              src={provider.logo}
                              alt={provider.name}
                              width={provider.id === "aws" ? 80 : 48}
                              height={40}
                              className="object-contain"
                            />
                          </div>
                          <Typography variant="body" className="font-medium">
                            {provider.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instanceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instance Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an instance type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedProvider?.instances.map((instance) => (
                        <SelectItem key={instance.id} value={instance.id}>
                          {instance.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Typography variant="h4">Autoscaling Configuration</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="kserveConfig.minReplicas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Replicas</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kserveConfig.maxReplicas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Replicas</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kserveConfig.scaleTargetUtilization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target CPU Utilization (%)</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deploying..." : "Deploy Model"}
          </Button>
        </form>
      </Form>
    </>
  )
}
