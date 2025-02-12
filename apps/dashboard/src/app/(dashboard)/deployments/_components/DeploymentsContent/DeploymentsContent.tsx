"use client"

import { Hero } from "../Hero/Hero"
import { SearchInput } from "../SearchInput/SearchInput"
import { Button } from "@package/ui/button"
import { PlusIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { DeploymentCard } from "../DeploymentCard/DeploymentCard"
import { useDeployments } from "../../_hooks/useDeployments"
import { Typography } from "@package/ui/typography"
import { BoxIcon } from "lucide-react"

export function DeploymentsContent() {
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""
  const { deployments } = useDeployments({ search })

  return (
    <section className="flex flex-col gap-4">
      <Hero />
      <section className="flex items-center gap-4">
        <SearchInput className="w-full" initialSearch={search} />
        <Link href="/deployments/new">
          <Button>
            <PlusIcon className="size-4" />
            <span className="hidden pl-1 md:block">New deployment</span>
          </Button>
        </Link>
      </section>
      {deployments.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 min-h-[calc(90vh-200px)]">
          <div className="flex flex-col items-center justify-center gap-2">
            <BoxIcon className="size-16 text-muted-foreground" />
            <Typography
              className="text-center text-muted-foreground"
              variant="h3"
            >
              No deployments found
            </Typography>
            <Typography
              className="text-center text-muted-foreground"
              variant="body"
            >
              <Link className="underline text-primary" href="/deployments/new">
                Deploy a model
              </Link>{" "}
              to get started
            </Typography>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {deployments.map((deployment) => (
            <DeploymentCard key={deployment.id} deployment={deployment} />
          ))}
        </div>
      )}
    </section>
  )
}
