export interface IPermissionAcl {
  namespace: string
  resource: string
  action: string
  effect: PermissionEffect
}

export interface IPermissionRequirement {
  namespace: string
  resource: string
  action: string
}

export enum PermissionEffect {
  UNKNOWN = "UNKNOWN",
  GRANT = "GRANT",
  FORBIDDEN = "FORBIDDEN",
}

export interface IRoleInfo {
  id: string
  name: string
  isPreserved: boolean
}

export interface ITenantInfo {
  id: string
  name: string
  displayName: string
  region: string
  logo?: BlobFile
  plan?: IPlanInfo
}

export interface IPlanInfo {
  key: string
  displayName: string
}

export interface BlobFile {
  url?: string
}
export interface IUserTenantInfo {
  isHost: boolean
  tenant?: ITenantInfo
}

export interface IUserInfo {
  id: string | number
  email: string
  username: string
  name: string
  avatar: string
  roles: IRoleInfo[]
  tenants: IUserTenantInfo[]
  currentTenant: IUserTenantInfo
}
