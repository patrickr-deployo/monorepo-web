import { Card, CardContent } from "@package/ui/card"
import { AlertCircle } from "lucide-react"
import { Typography } from "@package/ui/typography"

// TODO: Fetch from server
export function ErrorCard() {
  return (
    <Card>
      <CardContent className="flex items-center space-x-2 py-5">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <div className="flex-1">
          <Typography variant="h4" className="text-red-500">
            Error
          </Typography>
          <Typography variant="small" className="text-gray-400">
            245d ago by Deployo
          </Typography>
        </div>
        <button>
          <Typography variant="small">View</Typography>
        </button>
      </CardContent>
    </Card>
  )
}
