import { Metadata } from "next"
import { ContentLayout } from "@/components/Layouts"
import { DeploymentsContent } from "./_components/DeploymentsContent/DeploymentsContent"

export const metadata: Metadata = {
  title: "Deployments",
  description: "Deployments",
}

export default function DeploymentsPage() {
  return (
    <ContentLayout>
      <DeploymentsContent />
    </ContentLayout>
  )
}
