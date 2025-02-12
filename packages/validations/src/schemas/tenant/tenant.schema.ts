import { z } from "zod"

export const createTenantSchema = z.object({
  name: z.string(),
  // region: z.enum([
  //   "US_EAST_1",
  //   "US_WEST_1",
  //   "EU_CENTRAL_1",
  //   "EU_WEST_1",
  //   "AP_SOUTHEAST_1",
  //   "AP_NORTHEAST_1",
  //   "SA_EAST_1",
  //   "AF_SOUTH_1",
  // ]),
})

export type CreateTenantSchema = z.infer<typeof createTenantSchema>
