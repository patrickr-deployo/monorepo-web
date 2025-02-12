import { Nullable } from "../types"

const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7 // 7 days

export interface StorageInterface {
  set(key: string, value: any, expires?: number): void
  get<T = any>(key: string, def?: any): T
  remove(key: string): void
  clear(): void
  setCookie(key: string, value: any, options?: CookieOptions): void
  getCookie(key: string): string
  removeCookie(key: string): void
  clearCookie(): void
}

export interface CookieOptions {
  expires?: number
  path?: string
}

export const createStorage = ({
  prefixKey = "",
  storage = typeof window !== "undefined" ? localStorage : undefined,
} = {}) => {
  const Storage = class {
    private storage = storage
    private prefixKey?: string = prefixKey

    private getKey(key: string) {
      return `${this.prefixKey}${key}`
    }

    set(
      key: string,
      value: string,
      expires: Nullable<number> = DEFAULT_CACHE_TIME
    ) {
      const stringData = JSON.stringify({
        value,
        expire: expires !== null ? new Date().getTime() + expires * 1000 : null,
      })

      this.storage?.setItem(this.getKey(key), stringData)
    }

    get<T = any>(key: string, def?: any): T {
      const item = this.storage?.getItem(this.getKey(key))
      if (item) {
        try {
          const data = JSON.parse(item)
          const { value, expire } = data
          if (expire === null || expire >= Date.now()) {
            return value
          }

          this.remove(this.getKey(key))
        } catch (error) {
          return def
        }
      }
      return def
    }

    remove(key: string) {
      this.storage?.removeItem(this.getKey(key))
    }

    clear() {
      this.storage?.clear()
    }

    setCookie(
      key: string,
      value: string,
      options: CookieOptions = {
        path: "/",
        expires: DEFAULT_CACHE_TIME,
      }
    ) {
      document.cookie = `${this.getKey(key)}=${value}; max-age=${options.expires};path=${options.path}`
    }

    getCookie(key: string, def?: string) {
      const cookieArr = document.cookie.split("; ")
      const cookie = cookieArr.find((item) =>
        item.startsWith(`${this.getKey(key)}=`)
      )
      if (cookie) {
        return cookie.split("=")[1]
      }
    }

    removeCookie(key: string) {
      document.cookie = `${this.getKey(key)}=; Path=/; max-age=0`
    }

    clearCookie() {
      const keys = document.cookie.match(/[^ =;]+(?==)/g)
      if (keys) {
        keys.forEach((key) => {
          document.cookie = `${key}=; Path=/; max-age=0`
        })
      }
    }
  }

  return new Storage() as StorageInterface
}

export const Storage = createStorage()

export default Storage
