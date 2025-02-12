import { V1beta1Inference } from "@package/api"
import { Typography } from "@package/ui/typography"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import Link from "next/link"
import { Badge } from "@package/ui/badge"
import { CloudIcon, ClockIcon, NetworkIcon } from "lucide-react"

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

type DeploymentCardProps = {
  deployment: V1beta1Inference
}

export function DeploymentCard({ deployment }: DeploymentCardProps) {
  const status = deployment.status?.status || "STATUS_UNSPECIFIED"
  const statusColor = {
    STATUS_ALL_COMPONENTS_READY: "default",
    STATUS_PREDICTOR_READY: "default",
    STATUS_EXPLAINER_READY: "default",
    STATUS_TRANSFORMER_READY: "default",
    STATUS_ROUTES_READY: "default",
    STATUS_LATEST_DEPLOYMENT_READY: "default",
    STATUS_UNSPECIFIED: "secondary",
    STATUS_TERMINATED: "destructive",
  }[status] as "default" | "secondary" | "destructive"

  return (
    <Link href={`/deployments/${deployment.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Typography variant="h4" className="font-medium">
                {deployment.id}
              </Typography>
              <Badge variant={statusColor}>
                {status.replace("STATUS_", "")}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CloudIcon className="h-4 w-4" />
                <span>Instance:</span>
                <span className="font-medium text-foreground">
                  {deployment.instanceType}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ClockIcon className="h-4 w-4" />
                <span>Created:</span>
                <span className="font-medium text-foreground">
                  {diffInTime(deployment.createdAt || "")}
                </span>
              </div>
            </div>

            {deployment.status?.url && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <NetworkIcon className="h-4 w-4" />
                <span>Endpoint:</span>
                <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  {deployment.status.url}
                </code>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
