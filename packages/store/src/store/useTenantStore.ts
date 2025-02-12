import { create } from "zustand"
import { TenantServiceApi, V1Tenant } from "@package/api"
import { catchErrorTyped } from "@package/utils"

interface TenantState {
  tenants: V1Tenant[]
  currentTenant: V1Tenant | undefined
  tenantName: string
  loading: boolean
  error: string | undefined
  message: string | undefined
  setTenantName: (name: string) => void
  fetchTenants: () => Promise<void>
  fetchCurrentTenant: () => Promise<void>
  setCurrentTenant: (tenant: V1Tenant) => void
  createTenant: (tenantName: string) => Promise<void>
}

export const useTenantStore = create<TenantState>((set) => ({
  tenants: [],
  currentTenant: undefined,
  tenantName: "",
  loading: false,
  error: undefined,
  message: undefined,

  setTenantName: (name: string) => set({ tenantName: name }),

  fetchTenants: async () => {
    set({ loading: true, error: undefined })
    const service = new TenantServiceApi()
    const [error, data] = await catchErrorTyped(
      service.tenantServiceListTenant({
        pageSize: 20,
        pageOffset: 0,
      })
    )
    set({ loading: false })
    if (error) {
      set({ error: error.message })
      return
    }
    set({ tenants: data.data.items || [] })
  },

  fetchCurrentTenant: async () => {
    set({ loading: true, error: undefined })
    const service = new TenantServiceApi()
    const [error, data] = await catchErrorTyped(
      service.tenantServiceGetCurrentTenant()
    )
    set({ loading: false })
    if (error) {
      set({ error: error.message })

      return
    }
    set({ currentTenant: data.data.tenant })
  },

  setCurrentTenant: (tenant: V1Tenant) => set({ currentTenant: tenant }),

  createTenant: async (tenantName: string) => {
    if (!tenantName.trim()) {
      set({ error: "Tenant name cannot be empty." })
      return
    }

    set({ loading: true, error: undefined, message: undefined })
    const service = new TenantServiceApi()
    const [error, data] = await catchErrorTyped(
      service.tenantServiceCreateTenant({
        body: {
          name: tenantName.trim(),
          displayName: tenantName.trim().replace(/\s+/g, " ").toUpperCase(),
        },
      })
    )
    set({ loading: false })
    if (error) {
      set({ error: error.message })
      return
    }

    if (data.data) {
      set((state) => ({
        tenants: [...state.tenants, data.data],
        message: "Team created successfully",
        tenantName: "",
      }))
    } else {
      set({ error: "Failed to create tenant." })
    }
  },
}))
