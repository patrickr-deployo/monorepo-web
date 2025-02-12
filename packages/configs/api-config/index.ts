import axios from "axios"
import type { AxiosInstance } from "axios"
import {
  requestInterceptors,
  businessErrorInterceptor,
  tenantErrorInterceptor,
  csrfResponseInterceptor,
} from "@package/utils"

export const service: AxiosInstance = axios.create({
  timeout: 6000,
  withCredentials: true,
})

requestInterceptors.forEach((interceptor) => {
  service.interceptors.request.use(interceptor())
})

service.interceptors.response.use(...businessErrorInterceptor())
service.interceptors.response.use(...tenantErrorInterceptor())
service.interceptors.response.use(csrfResponseInterceptor())

export function setupService(fn: (service: AxiosInstance) => void) {
  fn(service)
}
