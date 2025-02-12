"use client"

import { useEffect } from "react"

import { Button } from "@package/ui/button"
import { Container } from "@package/ui/container"
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
    <Container>
      <Typography variant="h1">Something went wrong!</Typography>
      {error.message && <Typography variant="lead">{error.message}</Typography>}
      <Button
        onClick={
          () => reset()
        }
      >
        Try again
      </Button>
    </Container>
  )
}