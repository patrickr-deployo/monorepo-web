import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { IAuthStore } from "../types"
import { Nullable } from "@package/utils"
import {
  IPermissionAcl,
  IUserInfo,
  TENANT_KEY,
  ACCESS_TOKEN_KEY,
  PERMISSION_KEY,
  USER_INFO_KEY,
} from "@package/utils"
import { storage } from "../storage"

const STORAGE_KEY = "auth-store"
const PREFIX_KEY = "auth-"

export const useAuthStore = create<IAuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        [TENANT_KEY]: null,
        [ACCESS_TOKEN_KEY]: null,
        [USER_INFO_KEY]: null,
        [PERMISSION_KEY]: null,

        setTenantId: (tenantId: Nullable<string>) => {
          set({ [TENANT_KEY]: tenantId })
        },
        setAccessToken: (accessToken: Nullable<string>) => {
          set({ [ACCESS_TOKEN_KEY]: accessToken })
        },
        setUserInfo: (userInfo: Nullable<IUserInfo>) => {
          set({ [USER_INFO_KEY]: userInfo })
        },
        setPermission: (permission: Nullable<IPermissionAcl>) => {
          set({ [PERMISSION_KEY]: permission })
        },
        init: () => {},
        clear: () => {
          set({
            [TENANT_KEY]: null,
            [ACCESS_TOKEN_KEY]: null,
            [USER_INFO_KEY]: null,
            [PERMISSION_KEY]: null,
          })

          const keysToRemove = [
            TENANT_KEY,
            ACCESS_TOKEN_KEY,
            PERMISSION_KEY,
            USER_INFO_KEY,
          ]

          keysToRemove.forEach((key) => storage.removeItem(key))
        },
      }),
      {
        name: STORAGE_KEY,
        storage: storage,
        partialize: (state: IAuthStore) => ({
          [TENANT_KEY]: state[TENANT_KEY],
          [ACCESS_TOKEN_KEY]: state[ACCESS_TOKEN_KEY],
          [USER_INFO_KEY]: state[USER_INFO_KEY],
          [PERMISSION_KEY]: state[PERMISSION_KEY],
        }),
      }
    )
  )
)
