import { useCallback, useEffect, useState } from "react"
import { AuthApi, AccountApi, TenantServiceApi } from "@package/api"
import {
  Nullable,
  setAccessToken,
  QUERY_KEYS,
  IUserInfo,
  setSettingTenantId,
} from "@package/utils"

import {
  registerSchema,
  loginSchema,
  LoginSchema,
  RegisterSchema,
  changePasswordByForgetSchema,
  forgetPasswordSchema,
  ForgetPasswordSchema,
  ChangePasswordByForgetSchema,
} from "@package/validations"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

type UseLoginProps = {
  isRegister?: boolean
}

export function useAuth({ isRegister = false }: UseLoginProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [emailExpire, setEmailExpire] = useState<Nullable<string>>(null)

  const router = useRouter()

  const authService = new AuthApi()
  const accountService = new AccountApi()
  const tenantService = new TenantServiceApi()

  const registerLoginForm = useForm<RegisterSchema | LoginSchema>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  })

  const forgetPasswordForm = useForm<ForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordSchema),
  })

  const changePasswordByForgetForm = useForm<ChangePasswordByForgetSchema>({
    resolver: zodResolver(changePasswordByForgetSchema),
  })

  const userInfoQuery = useQuery({
    queryKey: QUERY_KEYS.USER_INFO(),
    queryFn: () => accountService.accountGetProfile(),
  })

  const registerMutation = useMutation({
    mutationKey: QUERY_KEYS.REGISTER(),
    mutationFn: authService.authRegister,
    onSuccess: (data) => {
      const { accessToken, refreshToken, tokenType, expiresIn } = data.data

      setAccessToken(accessToken as string)

      setMessage(
        "Registration successful. Please check your email for verification."
      )

      userInfoQuery.refetch().then((data) => {
        const currentUser = data.data?.data as IUserInfo

        if (currentUser) {
          if (currentUser.currentTenant?.isHost) {
            const nonHostTenant = selectNonHostTenant(currentUser)
            if (nonHostTenant) {
              changeCurrentTenantMutation.mutateAsync(nonHostTenant)
            }
          }
        }

        router.push("/")
      })
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const loginMutation = useMutation({
    mutationKey: QUERY_KEYS.LOGIN(),
    mutationFn: authService.authLogin,
    onSuccess: (data) => {
      const { accessToken, refreshToken, tokenType, expiresIn, redirect } =
        data.data

      setAccessToken(accessToken as string)

      setMessage("Login successful. Redirecting to dashboard.")

      userInfoQuery.refetch().then((data) => {
        const currentUser = data.data?.data as IUserInfo

        // find the first non-host tenant and set it as the current tenant
        if (currentUser) {
          if (currentUser.currentTenant?.isHost) {
            const nonHostTenant = selectNonHostTenant(currentUser)
            if (nonHostTenant) {
              changeCurrentTenantMutation.mutateAsync(nonHostTenant)
            }
          }
        }

        router.push(redirect || "/")
      })
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const changeCurrentTenantMutation = useMutation({
    mutationKey: QUERY_KEYS.CURRENT_TENANT(),
    mutationFn: (tenantId: string | undefined = "-") =>
      tenantService.tenantServiceChangeTenant({
        idOrName: tenantId,
        body: {},
      }),
    onSuccess: (data) => {
      if (data.data.isHost) {
        setSettingTenantId(null)
      } else {
        setSettingTenantId(data.data.tenant?.id ?? null)
      }

      router.refresh()

      userInfoQuery.refetch()
    },
  })

  const sendForgetPasswordMutation = useMutation({
    mutationKey: QUERY_KEYS.FORGET_PASSWORD(),
    mutationFn: authService.authSendForgetPasswordToken,
    onSuccess: (data) => {
      setMessage("Email sent. Please check your email.")
      setEmailExpire(data.data.expire as unknown as string)
    },
    onError: (error) => {
      setError("An unexpected error occurred. Please try again.")
    },
  })

  const changePasswordByForgetMutation = useMutation({
    mutationKey: QUERY_KEYS.CHANGE_PASSWORD_BY_FORGET(),
    mutationFn: authService.authChangePasswordByForget,
    onSuccess: (data) => {
      setMessage("Password changed. Please login.")
      router.push("/login")
    },
    onError: (error) => {
      setError("An unexpected error occurred. Please try again.")
    },
  })

  const handleLoginRegister = useCallback(
    async (values: RegisterSchema | LoginSchema) => {
      try {
        setError("")
        setLoading(true)

        if (isRegister) {
          const { email, password, confirmPassword } = values as RegisterSchema
          await registerMutation.mutateAsync({
            body: { email, password, confirmPassword, web: true },
          })
        } else {
          const { email, password, remember } = values as LoginSchema

          // await loginMutation.mutateAsync({
          //   body: { email, password, remember },
          // })

          // DEMO: demo login
          if (email === "patrick@deployo.ai" && password === "test8901") {
            router.push("/")
          } else {
            setError("Invalid email or password")
          }
        }
      } catch {
        setError(
          isRegister
            ? "An error occurred while registering. Please try again."
            : "An error occurred while logging in. Please try again."
        )
      } finally {
        setLoading(false)
      }
    },
    [isRegister, registerMutation, loginMutation]
  )

  const handleSendForgetEmail = useCallback(
    async (values: ForgetPasswordSchema) => {
      const { email } = values
      setLoading(true)

      try {
        await sendForgetPasswordMutation.mutateAsync({
          body: { email },
        })
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      } finally {
        setLoading(false)
      }
    },
    [sendForgetPasswordMutation]
  )

  const handleChangePasswordByForget = useCallback(
    async (values: ChangePasswordByForgetSchema, token: string) => {
      const { password, confirmPassword } = values

      try {
        await changePasswordByForgetMutation.mutateAsync({
          body: {
            changePasswordToken: token,
            newPassword: password,
            confirmNewPassword: confirmPassword,
          },
        })
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const selectNonHostTenant = (currentUser: IUserInfo) => {
    if (currentUser?.currentTenant?.isHost) {
      const nonHostTenant = currentUser.tenants?.find(
        (tenant) => !tenant.isHost
      )
      return nonHostTenant?.tenant?.id || null
    }
    return currentUser?.currentTenant?.tenant?.id || null
  }

  useEffect(() => {
    let isMounted = true
    return () => {
      isMounted = false
    }
  }, [])

  return {
    error,
    message,
    loading,
    emailExpire,
    handleLoginRegister,
    handleSendForgetEmail,
    handleChangePasswordByForget,
    registerLoginForm,
    forgetPasswordForm,
    changePasswordByForgetForm,
  }
}
