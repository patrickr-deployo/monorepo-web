import { Metadata } from "next"
import { OverviewContent } from "./_components/OverviewContent/OverviewContent"
import { ContentLayout } from "@/components/Layouts"
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
}

export default function DashboardPage() {
  return (
    <ContentLayout>
      <OverviewContent />
    </ContentLayout>
  )
}
