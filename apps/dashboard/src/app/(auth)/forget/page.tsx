import { Metadata } from "next"
import { Forget } from "@/app/(auth)/_components/Forget/Forget"
import { Container } from "@package/ui/container"
export const metadata: Metadata = {
  title: "Forget",
  description: "Forgot Password page",
}

export default function ForgotPasswordPage() {
  return (
    <Container className="flex items-center justify-center h-screen">
      <Forget />
    </Container>
  )
}
