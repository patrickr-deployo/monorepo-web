"use client"

import { useEffect } from "react"

import { Button } from "@package/ui/button"
import { Typography } from "@package/ui/typography"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="flex flex-col items-start gap-2">
      <Typography variant="h1">{error.name}</Typography>
      {error.message && <Typography variant="lead">{error.message}</Typography>}
      <Button onClick={() => reset()}>Try again</Button>
    </section>
  )
}
