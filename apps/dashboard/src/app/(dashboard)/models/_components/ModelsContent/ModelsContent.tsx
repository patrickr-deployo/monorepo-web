"use client"

import { useEffect, useState } from "react"
import { Hero } from "../Hero/Hero"
import { SearchInput } from "../SearchInput/SearchInput"
import Link from "next/link"
import { Button } from "@package/ui/button"
import { AlertTriangleIcon, PlusIcon } from "lucide-react"
import { Typography } from "@package/ui/typography"
import { BoxIcon } from "lucide-react"
import { useModels } from "../../_hooks/useModels"
import { useSearchParams } from "next/navigation"
import { ModelsTable } from "../ModelsTable/ModelsTable"
import { Skeleton } from "@package/ui/skeleton"
import { V1beta1Model, V1beta1ModelServingRuntime } from "@package/api"

export function ModelsContent() {
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""
  const { models } = useModels({ search })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <section className="flex flex-col gap-4">
      <Hero />
      <section className="flex items-center gap-4">
        <SearchInput className="w-full" initialSearch={search} />
        <Link href="/models/new">
          <Button>
            <PlusIcon className="size-4" />
            <span className="hidden pl-1 md:block">Add model</span>
          </Button>
        </Link>
      </section>
      {models.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 min-h-[calc(90vh-200px)]">
          <div className="flex flex-col items-center justify-center gap-2">
            <BoxIcon className="size-16 text-muted-foreground" />
            <Typography
              className="text-center text-muted-foreground"
              variant="h3"
            >
              No models found
            </Typography>
            <Typography
              className="text-center text-muted-foreground"
              variant="body"
            >
              <Link className="underline text-primary" href="/models/new">
                Add a model
              </Link>{" "}
              to get started
            </Typography>
          </div>
        </div>
      ) : (
        <ModelsTable models={models} />
      )}
    </section>
  )
}
