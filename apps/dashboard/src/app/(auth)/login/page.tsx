import { Auth } from "@/app/(auth)/_components/Auth/Auth"
import { Container } from "@package/ui/container"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  description: "Login page",
}

export default function LoginPage() {
  return (
    <Container className="flex items-center justify-center h-screen">
      <Auth />
    </Container>
  )
}
