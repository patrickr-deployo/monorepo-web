"use client"

import { Typography } from "@package/ui/typography"

export function Hero() {
  return (
    <section className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <Typography className="mb-4" variant="h1">
        Deployments
      </Typography>
      <section className="flex flex-wrap gap-2 md:items-center"></section>
    </section>
  )
}
