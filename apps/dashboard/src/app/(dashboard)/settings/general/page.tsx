import { GeneralSettingsContent } from "./_components/GeneralSettingsContent/GeneralSettingsContent"
import { ContentLayout } from "@/components/Layouts"

// TODO: Refactor and decide whether to use this page or not
export default function SettingsGeneralPage() {
  return (
    <ContentLayout>
      <GeneralSettingsContent />
    </ContentLayout>
  )
}
