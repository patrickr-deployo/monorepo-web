import { useRouter } from "next/navigation"
import { useState } from "react"
import { Storage } from "@package/utils"
import { useQueryClient } from "@tanstack/react-query"

export const useLogout = () => {
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [redirectUrl, setRedirectUrl] = useState<string>("")

  const router = useRouter()
  const queryClient = useQueryClient()

  const logout = async () => {
    setLoading(true)
    
    // Clear all local storage and cookies
    Storage.clear()
    Storage.removeCookie("__tenant")
    
    // Clear react-query cache
    queryClient.clear()

    // Set success state
    setIsSuccess(true)
    setLoading(false)

    // Redirect to login page
    router.push("/login")
  }

  return { logout, error, loading, isSuccess, redirectUrl }
}
