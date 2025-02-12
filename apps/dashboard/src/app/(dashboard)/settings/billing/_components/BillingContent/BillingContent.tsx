"use client"

import { useState, useEffect } from "react"
import { Separator } from "@package/ui/separator"
import { Typography } from "@package/ui/typography"
import { Card, CardContent, CardHeader } from "@package/ui/card"
import { PricingPlans } from "../PricingPlans/PricingPlans"
import { PlanServiceApi, type V1Plan, type V1Price } from "@package/api"
import { BillingHistory } from "../BillingHistory/BillingHistory"
import { featureFlags } from "@package/utils"

export default function BillingContent() {
  const [isYearlyBilling, setIsYearlyBilling] = useState(false)
  const [plans, setPlans] = useState<
    Map<string, Array<{ plan: V1Plan; price: V1Price }>>
  >(
    new Map([
      ["monthly", []],
      ["yearly", []],
    ])
  )

  useEffect(() => {
    async function fetchPlans() {
      try {
        const planSrv = new PlanServiceApi()
        const resp = await planSrv.planServiceGetAvailablePlans()
        const allPlans = resp.data.items ?? []

        const allPrices = allPlans.flatMap(
          (plan) => plan.prices?.map((price) => ({ plan, price })) ?? []
        )

        const newGroupedData = new Map<
          string,
          Array<{ plan: V1Plan; price: V1Price }>
        >()

        const monthlyPrices = allPrices
          .filter((item) => item.price.recurring?.interval === "month")
          .sort((a, b) =>
            Number(
              BigInt(a.price.default?.amount ?? 0) -
                BigInt(b.price.default?.amount ?? 0)
            )
          )

        const yearlyPrices = allPrices
          .filter((item) => item.price.recurring?.interval === "year")
          .sort((a, b) =>
            Number(
              BigInt(a.price.default?.amount ?? 0) -
                BigInt(b.price.default?.amount ?? 0)
            )
          )

        if (monthlyPrices.length > 0) {
          newGroupedData.set("monthly", monthlyPrices)
        }
        if (yearlyPrices.length > 0) {
          newGroupedData.set("yearly", yearlyPrices)
        }

        setPlans(newGroupedData)
      } catch (error) {
        console.error("Failed to fetch plans:", error)
      }
    }
    fetchPlans()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h1">Billing</Typography>
        <Typography variant="body" className="text-sm text-muted-foreground">
          Here you can manage your billing and payment methods.
        </Typography>
      </div>
      <Separator />

      <section>
        <Card>
          <CardHeader>
            <Typography variant="h2">Subscription Plans</Typography>
            <Typography
              variant="body"
              className="text-sm text-muted-foreground"
            >
              Choose the plan that best fits your needs
            </Typography>
          </CardHeader>
          <CardContent>
            <PricingPlans
              data={plans}
              currentPeriod={isYearlyBilling ? "yearly" : "monthly"}
              onPeriodChange={(value) => setIsYearlyBilling(value === "yearly")}
            />
          </CardContent>
        </Card>
      </section>

      {featureFlags.enableBillingHistory && <BillingHistory />}
    </div>
  )
}
