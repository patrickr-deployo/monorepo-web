"use client"

import { ContentLayout } from "@/components/Layouts"
import { Typography } from "@package/ui/typography"
import { useModels } from "../_hooks/useModels"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Badge } from "@package/ui/badge"
import { modelRuntimeToName } from "@/lib/modelRuntimes"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { CalendarIcon, LayersIcon, RocketIcon, TagIcon } from "lucide-react"
import { V1beta1ModelServingRuntime } from "@package/api"

interface ModelPageProps {
  params: { modelId: string }
}

export default function ModelPage({ params }: ModelPageProps) {
  const { models } = useModels({})
  const model = models.find(m => m.id === params.modelId)

  if (!model) {
    redirect("/models")
  }

  return (
    <ContentLayout>
      <div className="space-y-6">
        <div className="space-y-1">
          <Typography variant="h1">{model.name}</Typography>
          <Typography variant="body" className="text-muted-foreground">
            {model.description}
          </Typography>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RocketIcon className="size-4" />
                    Runtime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="body">
                    {modelRuntimeToName[model.deploymentConfig?.runtime || V1beta1ModelServingRuntime.Unspecified]}
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LayersIcon className="size-4" />
                    Versions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="body">
                    {model.versions?.length || 0} version(s)
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="size-4" />
                    Created
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="body">
                    {model.createdAt ? new Date(model.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </div>

            {model.tags && model.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TagIcon className="size-4" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag.key}: {tag.value}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="versions">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {model.versions?.map((version) => (
                    <div
                      key={version.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div>
                        <Typography variant="h4">Version {version.version}</Typography>
                        <Typography variant="small" className="text-muted-foreground">
                          ID: {version.id}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployments">
            <Card>
              <CardContent className="pt-6">
                {model.deploymentIds && model.deploymentIds.length > 0 ? (
                  <div className="space-y-4">
                    {model.deploymentIds.map((deploymentId) => (
                      <div
                        key={deploymentId}
                        className="flex items-center justify-between border-b pb-4 last:border-0"
                      >
                        <Typography variant="body">{deploymentId}</Typography>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body" className="text-muted-foreground text-center">
                    No deployments found
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  )
}
