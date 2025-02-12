import { Container } from "@package/ui/container"
import { ResetPassword } from "@/app/(auth)/_components/ResetPassword/ResetPassword"

export default function ForgetChangePasswordPage({
  params,
}: {
  params: { token: string }
}) {
  return (
    <Container className="flex items-center justify-center h-screen">
      <ResetPassword token={params.token} />
    </Container>
  )
}
