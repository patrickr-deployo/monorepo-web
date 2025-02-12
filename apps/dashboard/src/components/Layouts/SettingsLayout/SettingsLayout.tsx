import { SettingsSideNav } from "./SettingsMobileSideNav"
import { SettingsHeader } from "./SettingsHeader"

type SettingsLayoutProps = {
  children: React.ReactNode
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex flex-col space-y-6 min-h-dynamic-screen">
      <SettingsHeader />
      <div className="container flex flex-1 flex-col gap-12 px-4 pb-8 lg:flex-row">
        <aside className="sticky top-[89px] hidden h-[calc(100dvh-150px)] w-[200px] flex-col self-start lg:flex">
          <SettingsSideNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
