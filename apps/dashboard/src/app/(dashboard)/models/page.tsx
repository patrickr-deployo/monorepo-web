import { Metadata } from "next"
import { ContentLayout } from "@/components/Layouts"
import { ModelsContent } from "./_components/ModelsContent/ModelsContent"

export const metadata: Metadata = {
  title: "Model Registry",
  description: "Model Registry",
}

export default function ModelRegistryPage() {
  return (
    <ContentLayout>
      <ModelsContent />
    </ContentLayout>
  )
}
