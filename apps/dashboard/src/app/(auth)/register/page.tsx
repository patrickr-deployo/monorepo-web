import { Auth } from "@/app/(auth)/_components/Auth/Auth"
import { Container } from "@package/ui/container"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register",
  description: "Registration page",
}

export default function RegisterPage() {
  return (
    <Container className="flex items-center justify-center h-screen">
      <Auth isRegister />
    </Container>
  )
}
