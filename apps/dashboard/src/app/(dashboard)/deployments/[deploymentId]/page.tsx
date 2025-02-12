"use client"

import { ContentLayout } from "@/components/Layouts"
import { Typography } from "@package/ui/typography"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Badge } from "@package/ui/badge"
import {
  CloudIcon,
  NetworkIcon,
  CpuIcon,
  MemoryStickIcon,
  ClockIcon,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { useEffect, useState } from "react"
import { Button } from "@package/ui/button"
import { Input } from "@package/ui/input"
import { toast } from "@package/ui/toast"

// Initialize metrics at 0 since it's a new deployment
function generateMockMetrics(hours: number) {
  return Array.from({ length: hours }).map((_, i) => ({
    time: new Date(Date.now() - (hours - i) * 3600000).toISOString(),
    latency: 0,
    cpu: 0,
    memory: 0,
    requests: 0,
  }))
}

interface DeploymentPageProps {
  params: { deploymentId: string }
}

interface PredictionResponse {
  probabilities: number[]
  predictedClass: number
}

export default function DeploymentPage({ params }: DeploymentPageProps) {
  const [metrics, setMetrics] = useState(generateMockMetrics(24))
  const [input, setInput] = useState<string>("")
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock deployment data (reference to DeploymentForm lines 89-110)
  const deployment = {
    id: params.deploymentId,
    instanceType: "t2.xlarge",
    provider: "aws",
    version: "v1",
    tenantId: "tenant-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    status: {
      status: "STATUS_ALL_COMPONENTS_READY",
      url: `https://api.deployo.ai/v1/models/${params.deploymentId}/predict`,
      address: `${params.deploymentId}.default.svc.cluster.local`,
    },
  }

  async function handlePredict() {
    setIsLoading(true)
    try {
      const inputArray = input.split(",").map(Number)
      if (inputArray.length !== 10) {
        throw new Error("Input must be 10 comma-separated numbers")
      }

      // Simulate API call with realistic timing
      const startTime = Date.now()
      await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 400)
      )
      const endTime = Date.now()
      const latency = endTime - startTime

      // Generate realistic prediction
      const probabilities = [Math.random(), 1 - Math.random()]
      const predictedClass = probabilities[0] > probabilities[1] ? 0 : 1

      setPrediction({ probabilities, predictedClass })

      // Show immediate spike in metrics during inference
      const inferenceMetric = {
        time: new Date().toISOString(),
        latency: latency,
        cpu: 75, // Significant CPU spike during inference
        memory: 45, // Memory increases during model loading/inference
        requests: metrics[metrics.length - 1].requests + 1,
      }

      setMetrics((prev) => [...prev.slice(1), inferenceMetric])

      // Show realistic cooldown pattern after inference
      const cooldownSteps = [
        {
          cpu: 35, // CPU still elevated but dropping
          memory: 40, // Memory stays somewhat elevated due to model in memory
          delay: 1000,
        },
        {
          cpu: 15, // CPU returning to idle
          memory: 35, // Memory remains slightly elevated
          delay: 2000,
        },
        {
          cpu: 5, // CPU almost at idle
          memory: 30, // Memory stabilizes but doesn't return to 0 (model cached)
          delay: 3000,
        },
      ]

      // Apply each cooldown step
      for (const [index, step] of cooldownSteps.entries()) {
        setTimeout(() => {
          setMetrics((prev) => [
            ...prev.slice(1),
            {
              time: new Date().toISOString(),
              latency: 0, // No active request
              cpu: step.cpu,
              memory: step.memory,
              requests: inferenceMetric.requests,
            },
          ])
        }, step.delay)
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description:
          "Invalid input format. Please provide 10 comma-separated numbers.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ContentLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Typography variant="h1">Deployment Details</Typography>
            <Typography variant="body" className="text-muted-foreground">
              Monitor and manage your deployment
            </Typography>
          </div>
          <Badge variant="default">
            {deployment.status.status.replace("STATUS_", "")}
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Latency"
                value={`${Math.round(metrics[metrics.length - 1].latency)}ms`}
                icon={<ClockIcon className="h-4 w-4" />}
              />
              <MetricCard
                title="CPU Usage"
                value={`${Math.round(metrics[metrics.length - 1].cpu)}%`}
                icon={<CpuIcon className="h-4 w-4" />}
              />
              <MetricCard
                title="Memory Usage"
                value={`${Math.round(metrics[metrics.length - 1].memory)}%`}
                icon={<MemoryStickIcon className="h-4 w-4" />}
              />
              <MetricCard
                title="Requests/min"
                value={metrics[metrics.length - 1].requests.toString()}
                icon={<NetworkIcon className="h-4 w-4" />}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Latency Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tickFormatter={(time) =>
                        new Date(time).toLocaleTimeString()
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) =>
                        new Date(label).toLocaleString()
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="latency"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prediction API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-2 bg-muted p-4 rounded-lg">
                  <Badge variant="secondary">POST</Badge>
                  <code className="text-sm flex-1">
                    {deployment.status.url}
                  </code>
                </div>

                <div className="space-y-4">
                  <div>
                    <Typography variant="h4" className="mb-2">
                      Request Body
                    </Typography>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm">
                        {`{
  "inputs": [number, number, number, number, number, number, number, number, number, number]
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Typography variant="body">
                      Example input values:
                    </Typography>
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0"
                        className="font-mono text-sm"
                      />
                      <Button onClick={handlePredict} disabled={isLoading}>
                        {isLoading ? "Predicting..." : "Try it out"}
                      </Button>
                    </div>
                  </div>
                </div>

                {prediction && (
                  <div className="space-y-4">
                    <Typography variant="h4">Response</Typography>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Status: 200 OK</Badge>
                        <Badge variant="outline">Time: 123ms</Badge>
                      </div>
                      <pre className="text-sm">
                        {JSON.stringify(
                          {
                            predicted_class: prediction.predictedClass,
                            probabilities: prediction.probabilities.map((p) =>
                              Number(p.toFixed(4))
                            ),
                            model_version: deployment.version,
                            timestamp: new Date().toISOString(),
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="space-y-4 border-t pt-4">
                  <Typography variant="h4">API Documentation</Typography>
                  <div className="space-y-2">
                    <Typography
                      variant="small"
                      className="text-muted-foreground font-medium"
                    >
                      Request Format
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      The API expects an array of 10 numerical values between 0
                      and 1 as input. Values should be comma-separated.
                    </Typography>
                  </div>
                  <div className="space-y-2">
                    <Typography
                      variant="small"
                      className="text-muted-foreground font-medium"
                    >
                      Response Format
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      The API returns a JSON object containing the predicted
                      class (0 or 1), probability scores for each class, the
                      model version used for inference, and a timestamp.
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardContent className="p-6">
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[500px]">
                  {/* Mock logs */}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="font-mono text-sm">
                      [{new Date(Date.now() - i * 60000).toISOString()}] INFO:
                      Request processed successfully
                    </div>
                  ))}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuration">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      Instance Type
                    </Typography>
                    <Typography variant="body">
                      {deployment.instanceType}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      Cloud Provider
                    </Typography>
                    <Typography variant="body">
                      {deployment.provider.toUpperCase()}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      Version
                    </Typography>
                    <Typography variant="body">
                      {deployment.version || "v1"}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      Tenant ID
                    </Typography>
                    <Typography variant="body">
                      {deployment.tenantId}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      Last Updated
                    </Typography>
                    <Typography variant="body">
                      {new Date(deployment.updatedAt || "").toLocaleString()}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      Endpoint URL
                    </Typography>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {deployment.status.url}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  )
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {title === "Latency" && Number(value.replace("ms", "")) > 100 ? (
            <span className="text-red-500">{value}</span>
          ) : (
            value
          )}
        </div>
      </CardContent>
    </Card>
  )
}
