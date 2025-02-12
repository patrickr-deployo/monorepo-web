import { Nullable } from "@package/utils"
import type {
  IUserInfo,
  IPermissionAcl,
  USER_INFO_KEY,
  PERMISSION_KEY,
  ACCESS_TOKEN_KEY,
  TENANT_KEY,
} from "@package/utils"

export interface IAuthStore {
  [TENANT_KEY]: Nullable<string>
  [ACCESS_TOKEN_KEY]: Nullable<string>
  [USER_INFO_KEY]: Nullable<IUserInfo>
  [PERMISSION_KEY]: Nullable<IPermissionAcl>

  setTenantId: (tenantId: Nullable<string>) => void
  setAccessToken: (accessToken: Nullable<string>) => void
  setUserInfo: (userInfo: Nullable<IUserInfo>) => void
  setPermission: (permission: Nullable<IPermissionAcl>) => void
  init: () => void
  clear: () => void
}
