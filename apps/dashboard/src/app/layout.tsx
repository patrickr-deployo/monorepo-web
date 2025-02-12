import { RootLayout } from "@/components/Layouts"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_URL!

export const metadata: Metadata = {
  // TODO: Remove this hacky url
  metadataBase: new URL("http://localhost:8080"),
  title: {
    template: "%s | Deployo",
    default: "Deployo",
  },
}

export default RootLayout
