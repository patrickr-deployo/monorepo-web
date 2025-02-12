import { Separator } from "@package/ui/separator"
import { Typography } from "@package/ui/typography"
import { ProfileForm } from "../ProfileForm/ProfileForm"

export function GeneralSettingsContent() {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <Typography variant="h1">General Settings</Typography>
          <Typography variant="body" className="text-sm text-muted-foreground">
            Here you can update and customize your general account settings.
          </Typography>
        </div>
        <Separator />
      </div>
      <div className="space-y-20">
        <div className="space-y-2">
          <ProfileForm />
        </div>
      </div>
    </div>
  )
}
