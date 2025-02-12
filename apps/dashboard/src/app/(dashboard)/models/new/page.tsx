"use client"

import { Typography } from "@package/ui/typography"
import { ContentLayout } from "@/components/Layouts"
import { ModelForm } from "../_components/ModelForm/ModelForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@package/ui/card"

export default function ModelNewPage() {
  return (
    <ContentLayout>
      <div className="space-y-6">
        <div>
          <Typography variant="h1">New Model</Typography>
          <Typography variant="body" className="text-muted-foreground">
            Add a new model to your registry
          </Typography>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Model Details</CardTitle>
            <CardDescription>
              Enter the basic information about your model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ModelForm />
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  )
}
