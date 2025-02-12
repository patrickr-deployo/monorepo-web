import { SettingsLinks } from "./SettingsLinks"

export function SettingsSideNav() {
  return (
    <div className="hidden flex-1 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <SettingsLinks />
        </div>
      </div>
    </div>
  )
}
