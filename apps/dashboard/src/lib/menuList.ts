import {
  LayoutGrid,
  LucideIcon,
  Package,
  FileText,
  Settings2,
  Users,
} from "lucide-react"
import { IPermissionRequirement } from "@package/utils"

type Submenu = {
  href: string
  label: string
  active?: boolean
  icon?: LucideIcon
  path?: string
  requirement?: IPermissionRequirement[]
  ignoreAuth?: boolean
}

type Menu = {
  href: string
  label: string
  active?: boolean
  icon: LucideIcon
  submenus?: Submenu[]
  path?: string
  requirement?: IPermissionRequirement[]
  ignoreAuth?: boolean
}

type Group = {
  groupLabel: string
  menus: Menu[]
}

export function getDashboardMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          path: "/",
          label: "Overview",
          icon: LayoutGrid,
          submenus: [],
          ignoreAuth: true,
        },
      ],
    },
    {
      groupLabel: "Workspace",
      menus: [
        {
          href: "/deployments",
          path: "/deployments",
          label: "Deployments",
          icon: Package,
          requirement: [
            {
              namespace: "deployments",
              resource: "deployment",
              action: "read",
            },
          ],
          submenus: [],
        },
        {
          href: "/models",
          path: "/models",
          label: "Models",
          icon: FileText,
          requirement: [
            {
              namespace: "models",
              resource: "model",
              action: "read",
            },
          ],
          submenus: [],
        },
        {
          href: "/members",
          path: "/members",
          label: "Members",
          icon: Users,
          requirement: [
            {
              namespace: "members",
              resource: "member",
              action: "read",
            },
          ],
          submenus: [],
        },
        {
          href: "/settings",
          path: "/settings",
          label: "Settings",
          icon: Settings2,
          requirement: [
            {
              namespace: "settings",
              resource: "setting",
              action: "read",
            },
          ],
          submenus: [
            {
              href: "/settings/general",
              path: "/settings/general",
              label: "General",
              requirement: [
                {
                  namespace: "settings",
                  resource: "general",
                  action: "read",
                },
              ],
            },
            {
              href: "/settings/billing",
              path: "/settings/billing",
              label: "Billing",
              requirement: [
                {
                  namespace: "settings",
                  resource: "billing",
                  action: "read",
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}
