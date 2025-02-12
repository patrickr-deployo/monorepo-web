"use client"

import { Sidebar } from "./DashboardSidebar"
import { useSidebar } from "@package/store"
import { useStore } from "@/hooks/useStore"
import { cn } from "@package/utils"
import { useQuery } from "@tanstack/react-query"
import { AccountApi } from "@package/api"
import { useRouter } from "next/navigation"
import { QUERY_KEYS } from "@package/utils"

type DashboardLayoutProps = {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const sidebar = useStore(useSidebar, (x) => x)
  const service = new AccountApi()

  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery({
    queryKey: QUERY_KEYS.USER_INFO(),
    queryFn: service.accountGetProfile,
  })

  if (!sidebar) return null
  const { getOpenState, settings } = sidebar

  if (process.env.NEXT_PUBLIC_APP_ENV != "development") {
    if (isError) {
      router.push("/login")
      return null
    }

    if (isLoading) return null

    if (!userInfo || !userInfo.data) {
      router.push("/login")
      return null
    }
  }

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-60")
        )}
      >
        {children}
      </main>
    </>
  )
}
