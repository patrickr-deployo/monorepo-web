import { AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { getAccessToken, getSettingTenantId, setSettingTenantId } from "./auth"
import { CSRF_TOKEN_KEY, TENANT_KEY } from "../enums"
import storage, { Storage } from "./storage"
import { CustomError, isErrorMessage } from "./error"

export function authRequestInterceptor() {
  return function (config: InternalAxiosRequestConfig) {
    const token = getAccessToken()
    config.headers = config.headers || {}
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
}

export function csrfRequestInterceptor() {
  return function (config: InternalAxiosRequestConfig) {
    const csrfToken = Storage.getCookie(CSRF_TOKEN_KEY)
    config.headers = config.headers || {}
    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken
    }
    return config
  }
}
export function saasRequestInterceptor() {
  return function (config: InternalAxiosRequestConfig) {
    const t = getSettingTenantId()
    config.headers = config.headers || {}
    if (t) {
      config.headers["__tenant"] = t
      console.log("saasRequestInterceptor", config.headers)
    }
    return config
  }
}

// TODO: Add response interceptors
export function authResponseInterceptor(
  unauthorizedAction?: () => void,
  forbiddenAction?: () => void
) {
  return [
    (resp: AxiosResponse) => {
      return resp
    },
    (error: any) => {
      const code =
        error.code ??
        error.wrap?.response?.status ??
        error?.response?.status ??
        0
      if (code == 401) {
        unauthorizedAction?.()
      }
      if (code == 403) {
        forbiddenAction?.()
      }
      return Promise.reject(error)
    },
  ]
}

export function csrfResponseInterceptor() {
  return function (res: AxiosResponse) {
    if (res.headers[CSRF_TOKEN_KEY]) {
      storage.setCookie(CSRF_TOKEN_KEY, res.headers[CSRF_TOKEN_KEY])
    }
    return res
  }
}

export function businessErrorInterceptor() {
  return [
    (resp: AxiosResponse) => {
      return resp
    },
    (error: any) => {
      if (error.response) {
        const data = error.response.data || {}
        if (isErrorMessage(data)) {
          return Promise.reject(
            new CustomError(data.code, data.reason, data.message, error)
          )
        }
      }
      return Promise.reject(error)
    },
  ]
}

export function tenantErrorInterceptor() {
  return [
    (resp: AxiosResponse) => {
      return resp
    },
    (error: any) => {
      if (error instanceof CustomError) {
        if (["TENANT_NOT_FOUND", "TENANT_FORBIDDEN"].includes(error.reason)) {
          setSettingTenantId()
          window.location.reload()
        }
      }
      return Promise.reject(error)
    },
  ]
}

export const requestInterceptors: (() => (
  config: InternalAxiosRequestConfig
) => InternalAxiosRequestConfig)[] = [
  authRequestInterceptor,
  csrfRequestInterceptor,
  saasRequestInterceptor,
]
