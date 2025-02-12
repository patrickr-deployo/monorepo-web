"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@package/ui/button"
import { Input } from "@package/ui/input"
import { Textarea } from "@package/ui/textarea"
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
import { V1beta1ModelServingRuntime, V1beta1ModelTag } from "@package/api"
import { modelRuntimeToName } from "@/lib/modelRuntimes"
import { FileUpload } from "../FileUpload/FileUpload"
import { Badge } from "@package/ui/badge"
import { Typography } from "@package/ui/typography"
import { useRouter } from "next/navigation"
import { toast } from "@package/ui/toast"
import { useState } from "react"
import { V1beta1Model } from "@package/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@package/ui/alert-dialog"
import { demoModels } from "../../_hooks/useModels"
import { PlusIcon, XIcon } from "lucide-react"

const modelFormSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  initialVersion: z.object({
    version: z.string().min(1),
    id: z.string().optional(),
  }),
  basicDeploymentConfig: z.object({
    runtime: z.nativeEnum(V1beta1ModelServingRuntime),
  }),
  tags: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  metadata: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
})

type ModelFormValues = z.infer<typeof modelFormSchema>

export function ModelForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeployPrompt, setShowDeployPrompt] = useState(false)
  const [createdModelId, setCreatedModelId] = useState<string>("")
  const [tags, setTags] = useState<V1beta1ModelTag[]>([])
  const [newTagKey, setNewTagKey] = useState("")
  const [newTagValue, setNewTagValue] = useState("")
  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      initialVersion: {
        version: "1.0.0",
      },
      basicDeploymentConfig: {
        runtime: V1beta1ModelServingRuntime.Unspecified,
      },
    },
  })

  async function onSubmit(data: ModelFormValues) {
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newModel: V1beta1Model = {
      id: `model-${Math.random().toString(36).slice(2, 9)}`,
      name: data.name,
      description: data.description,
      versions: [{ version: data.initialVersion.version, id: "v1" }],
      deploymentIds: [],
      deploymentConfig: {
        runtime: data.basicDeploymentConfig.runtime,
      },
      tags: tags,
      metadata: data.metadata || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tenantId: "acme-corp",
      internal: false,
    }

    console.log("Created model:", newModel)
    setCreatedModelId(newModel.id || "")

    const existingModels = JSON.parse(localStorage.getItem("models") || "[]")
    const modelsToSave =
      existingModels.length === 0
        ? [...demoModels, newModel]
        : [...existingModels, newModel]

    localStorage.setItem("models", JSON.stringify(modelsToSave))

    toast({
      title: "Model created successfully",
      description: "Your model has been created and is ready to use.",
      variant: "default",
    })

    setShowDeployPrompt(true)
  }

  function handleFileUpload(file: File) {
    console.log("File uploaded:", file)
    // TODO: Implement S3 upload
  }

  function handleDeploy() {
    router.push("/deployments/new?modelId=" + createdModelId)
  }

  function handleSkip() {
    router.push("/models")
    router.refresh()
  }

  const handleAddTag = () => {
    if (newTagKey && newTagValue) {
      setTags([...tags, { key: newTagKey, value: newTagValue }])
      setNewTagKey("")
      setNewTagValue("")
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <Typography variant="h4">Model Files</Typography>
            <FileUpload onUpload={handleFileUpload} />
          </div>

          <div className="space-y-4">
            <Typography variant="h4">Basic Information</Typography>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., bert-base-uncased, resnet50, stable-diffusion-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., BERT base model (uncased) for natural language processing tasks, trained on English text."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <Typography variant="h4">Version & Runtime</Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="initialVersion.version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Version</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1.0.0, v1, latest" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="basicDeploymentConfig.runtime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Runtime</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a runtime for your model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(V1beta1ModelServingRuntime)
                          .filter(([key]) => key !== "Unspecified")
                          .map(([key, value]) => (
                            <SelectItem key={value} value={value}>
                              <div className="flex items-center gap-2">
                                {modelRuntimeToName[value]}
                                {key === "HuggingfaceModelserver" && (
                                  <Badge variant="secondary">Recommended</Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Typography variant="h4">Tags</Typography>

            <div className="flex gap-2">
              <Input
                placeholder="Tag Key (e.g., Framework)"
                value={newTagKey}
                onChange={(e) => setNewTagKey(e.target.value)}
              />
              <Input
                placeholder="Tag Value (e.g., PyTorch)"
                value={newTagValue}
                onChange={(e) => setNewTagValue(e.target.value)}
              />
              <Button type="button" onClick={handleAddTag}>
                <PlusIcon className="size-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                >
                  {tag.key}: {tag.value}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-1 hover:text-red-600"
                  >
                    <XIcon className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Model"}
          </Button>
        </form>
      </Form>

      <AlertDialog open={showDeployPrompt} onOpenChange={setShowDeployPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deploy your model?</AlertDialogTitle>
            <AlertDialogDescription>
              Your model has been created successfully. Would you like to deploy
              it now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSkip}>
              Skip for now
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeploy}>
              Deploy model
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
