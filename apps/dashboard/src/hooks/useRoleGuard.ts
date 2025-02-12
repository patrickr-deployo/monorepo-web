import { MenuServiceApi, PermissionServiceApi } from "@package/api"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@package/utils"
import { useRouter } from "next/router"
import type { IPermissionAcl, IPermissionRequirement } from "@package/utils"

interface UseRoleGuardProps {
  requiredPermissions?: IPermissionRequirement[]
}

export function useRoleGuard({ requiredPermissions }: UseRoleGuardProps = {}) {
  const menuApi = new MenuServiceApi()
  const permissionApi = new PermissionServiceApi()
  const router = useRouter()

  const { data: userInfo } = useQuery({
    queryKey: QUERY_KEYS.USER_INFO(),
  })

  const { data: currentPermissions } = useQuery({
    queryKey: QUERY_KEYS.CURRENT_PERMISSIONS(),
    queryFn: permissionApi.permissionServiceGetCurrent,
    enabled: !!userInfo,
    select: (response) => response.data.acl as IPermissionAcl[],
  })

  const availableMenusQuery = useQuery({
    queryKey: QUERY_KEYS.AVAILABLE_MENUS(),
    queryFn: menuApi.menuServiceGetAvailableMenus,
    enabled: !!userInfo,
    select: (response) => response.data.items || [],
  })

  if (!userInfo) {
    return {
      isAuthorized: false,
      isLoading: false,
      menus: [],
    }
  }

  const hasMenuAccess = Boolean(
    availableMenusQuery.data?.some((menu) => {
      if (menu.ignoreAuth) {
        return true
      }

      if (router.pathname === menu.path) {
        return true
      }

      if (router.pathname.startsWith(menu.path ?? "")) {
        return true
      }

      return false
    })
  )

  const hasRequiredPermissions = requiredPermissions
    ? requiredPermissions.every((required) =>
        currentPermissions?.some(
          (permission) =>
            permission.namespace === required.namespace &&
            permission.resource === required.resource &&
            permission.action === required.action &&
            permission.effect === "GRANT"
        )
      )
    : true

  return {
    isAuthorized: hasMenuAccess && hasRequiredPermissions,
    isLoading: availableMenusQuery.isLoading,
    menus: availableMenusQuery.data || [],
  }
}
