import BillingContent from "./_components/BillingContent/BillingContent"
import { ContentLayout } from "@/components/Layouts"
import { StripeProvider } from "./_components/StripeProvider/StripeProvider"

export default function SettingsBillingPage() {
  return (
    <ContentLayout>
      <StripeProvider>
        <BillingContent />
      </StripeProvider>
    </ContentLayout>
  )
}
