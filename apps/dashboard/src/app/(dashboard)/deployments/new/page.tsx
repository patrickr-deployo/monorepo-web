"use client"

import { Typography } from "@package/ui/typography"
import { ContentLayout } from "@/components/Layouts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@package/ui/card"
import { DeploymentForm } from "../_components/DeploymentForm/DeploymentForm"

export default function DeploymentNewPage() {
  return (
    <ContentLayout>
      <div className="space-y-6">
        <div>
          <Typography variant="h1">New Deployment</Typography>
          <Typography variant="body" className="text-muted-foreground">
            Deploy your model to production
          </Typography>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deployment Details</CardTitle>
            <CardDescription>
              Configure how your model will be deployed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeploymentForm />
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  )
}
