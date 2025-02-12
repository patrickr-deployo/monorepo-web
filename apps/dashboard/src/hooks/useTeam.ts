import { useTenantStore } from "@package/store"
import { useCallback, useState } from "react"
import { AccountApi, TenantServiceApi } from "@package/api"
import { QUERY_KEYS, setSettingTenantId } from "@package/utils"
import { useToast } from "@package/ui/toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTenantSchema, CreateTenantSchema } from "@package/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const DEMO_TENANTS = [
  {
    tenant: {
      id: "host-org",
      name: "HOSTORG",
      displayName: "Host Organization",
      logo: {
        url: "https://avatars.githubusercontent.com/u/12345678?v=4"
      },
      plan: {
        active: true,
        displayName: "Enterprise",
      }
    },
    isHost: true,
    tenantId: "host-org"
  },
  {
    tenant: {
      id: "acme-corp",
      name: "ACMECORP",
      displayName: "Acme Corporation",
      logo: {
        url: "https://ui-avatars.com/api/?name=Acme+Corp&background=0D8ABC&color=fff"
      },
      plan: {
        active: true,
        displayName: "Pro"
      }
    },
    isHost: false,
    tenantId: "acme-corp"
  },
  {
    tenant: {
      id: "startup-inc",
      name: "STARTUPINC",
      displayName: "Startup Inc",
      logo: {
        url: "https://ui-avatars.com/api/?name=Startup+Inc&background=FF4B4B&color=fff"
      },
      plan: {
        active: true,
        displayName: "Free"
      }
    },
    isHost: false,
    tenantId: "startup-inc"
  }
];

const DEMO_CURRENT_TENANT = {
  isHost: false,
  tenant: {
    id: "acme-corp",
    name: "ACMECORP", 
    displayName: "Acme Corporation",
    logo: {
      url: "https://ui-avatars.com/api/?name=Acme+Corp&background=0D8ABC&color=fff"
    },
    plan: {
      active: true,
      displayName: "Pro"
    }
  }
};

export function useTeam() {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [currentDemoTenant, setCurrentDemoTenant] = useState(DEMO_CURRENT_TENANT)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const tenantService = new TenantServiceApi()
  const accountService = new AccountApi()

  const tenants = useQuery({
    queryKey: QUERY_KEYS.USER_INFO(),
    queryFn: () => Promise.resolve({ data: { tenants: DEMO_TENANTS } }),
  })?.data?.data?.tenants

  const currentTenant = useQuery({
    queryKey: QUERY_KEYS.CURRENT_TENANT(),
    queryFn: () => Promise.resolve({ data: currentDemoTenant }),
  })?.data?.data

  const createTenantForm = useForm<CreateTenantSchema>({
    resolver: zodResolver(createTenantSchema),
  })

  const changeCurrentTenantMutation = useMutation({
    mutationKey: QUERY_KEYS.CURRENT_TENANT(),
    mutationFn: async (tenantId: string) => {
      // Find the demo tenant that matches the ID
      const newTenant = DEMO_TENANTS.find(t => t.tenant.id === tenantId)
      if (!newTenant) {
        throw new Error(`Tenant with ID ${tenantId} not found`)
      }
      
      // Update the current demo tenant
      setCurrentDemoTenant({
        isHost: newTenant.isHost,
        tenant: newTenant.tenant
      })

      return { data: newTenant }
    },
    onSuccess: (data) => {
      if (data.data.isHost) {
        setSettingTenantId(null)
      } else {
        setSettingTenantId(data.data.tenant?.id ?? null)
      }

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_INFO() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_TENANT() })

      toast({
        title: "Success",
        description: "Team changed successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const createTenantMutation = useMutation({
    mutationKey: QUERY_KEYS.CREATE_TENANT(),
    mutationFn: tenantService.tenantServiceUserCreateTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_INFO() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_TENANT() })

      toast({
        title: "Success",
        description: "Tenant created successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleSetCurrentTenant = useCallback(
    async (tenantId: string) => {
      setLoading(true)
      const tenant = tenants?.find((t) => t.tenant?.id === tenantId)
      if (tenant) {
        await changeCurrentTenantMutation.mutateAsync(tenantId)
      } else {
        useTenantStore.setState({
          error: `Team with ID ${tenantId} not found.`,
        })
      }
      setLoading(false)
    },
    [changeCurrentTenantMutation, tenants]
  )

  const handleCreateTenant = useCallback(
    async (values: CreateTenantSchema) => {
      setLoading(true)
      await createTenantMutation.mutateAsync({
        body: {
          name: values.name.replace(/\s+/g, "").toUpperCase(),
          displayName: values.name,
        },
      })
      setLoading(false)
    },
    [createTenantMutation]
  )

  return {
    tenants: DEMO_TENANTS,
    currentTenant: currentDemoTenant,
    handleSetCurrentTenant,
    handleCreateTenant,
    createTenantForm,
    loading,
    error,
    message,
  }
}
