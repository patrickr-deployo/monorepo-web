// storage/CustomStorage.ts
import { PersistStorage, StorageValue } from "zustand/middleware"
import { Nullable } from "@package/utils"

const DEFAULT_EXPIRES_TIME = 60 * 60 * 24 * 7 // 7 days

export class CustomStorage<T> implements PersistStorage<T> {
  prefixKey: string

  constructor(prefixKey: string = "") {
    this.prefixKey = prefixKey
  }

  private getKey(key: string) {
    return `${this.prefixKey}${key}`
  }

  setItem = (
    key: string,
    value: StorageValue<T>,
    expires: Nullable<number> = DEFAULT_EXPIRES_TIME
  ) => {
    const stringData = JSON.stringify({
      value,
      expires: expires !== null ? Date.now() + expires * 1000 : null,
    })
    localStorage.setItem(this.getKey(key), stringData)
  }

  getItem = (key: string, def?: any): StorageValue<T> | null => {
    const item = localStorage.getItem(this.getKey(key))
    if (item) {
      try {
        const data = JSON.parse(item)
        const { value, expires } = data
        if (expires === null || expires >= Date.now()) {
          return value
        }
        localStorage.removeItem(this.getKey(key))
      } catch (e) {
        return def
      }
    }
    return def
  }

  removeItem = (key: string) => {
    localStorage.removeItem(this.getKey(key))
  }
}

export const storage = new CustomStorage("auth-")
