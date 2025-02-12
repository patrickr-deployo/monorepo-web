import { V1beta1Model } from "@package/api"
import { ModelRuntime, modelRuntimeToName } from "@/lib/modelRuntimes"

import { Typography } from "@package/ui/typography"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import Link from "next/link"

function diffInTime(date: string) {
  const diffInSeconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  )
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays}d ago`

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) return `${diffInMonths}mo ago`

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}y ago`
}

type ModelCardProps = {
  model: V1beta1Model
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Card className="flex-1 shadow-md hover:shadow-2xl transition-shadow duration-300 ">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 pb-4">
        <Link href={`/models/${model.id}`} className="hover:underline">
          <CardTitle className="flex items-center gap-2">
            <Typography
              variant="h4"
              className="font-semibold text-primary underline cursor-pointer"
            >
              {model.name}
            </Typography>
          </CardTitle>
        </Link>
        <Typography variant="small" className="text-muted-foreground">
          Created on: {new Date(model.createdAt || "").toLocaleDateString()}
        </Typography>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Updated __ seconds/minutes/hours/days ago */}
        {model.updatedAt && (
          <Typography variant="small" className="text-muted-foreground">
            Updated {diffInTime(model.updatedAt)}
          </Typography>
        )}
        {model.description && (
          <Typography
            variant="body"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            {model.description}
          </Typography>
        )}
        {model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {model.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800  rounded-full text-xs"
              >
                {tag.key}: {tag.value}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-4">
          <Typography
            variant="body"
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            <strong>Versions:</strong> {model.versions?.length || 0}
          </Typography>
          <Typography
            variant="body"
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            <strong>Deployments:</strong> {model.deploymentIds?.length || 0}
          </Typography>
          <Typography
            variant="body"
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            <strong>Runtime:</strong>{" "}
            {
              modelRuntimeToName[
                model.deploymentConfig?.runtime! || "Unspecified"
              ]
            }
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}
