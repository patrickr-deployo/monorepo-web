import { Button } from "@package/ui/button"
import { Container } from "@package/ui/container"
import { Typography } from "@package/ui/typography"
import Link from "next/link"
import { Frown, Compass, Search } from "lucide-react"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
}

export default function NotFoundPage() {
  return (
    <Container className="flex flex-col items-center justify-center min-h-screen space-y-6 p-4">
      <Frown
        className="w-24 h-24 text-gray-500 animate-pulse"
        aria-label="Frown Icon"
      />
      <Typography variant="h1" className="text-4xl">
        Oops! Page Not Found
      </Typography>
      <Typography variant="lead" className="text-center">
        We can't seem to find the page you're looking for.
      </Typography>
      <div className="flex space-x-4">
        <Button asChild>
          <Link href="/">
            <Compass className="w-5 h-5 mr-2" aria-hidden="true" />
            Return Home
          </Link>
        </Button>
      </div>
    </Container>
  )
}
