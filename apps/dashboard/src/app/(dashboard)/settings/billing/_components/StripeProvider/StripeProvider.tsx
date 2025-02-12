"use client"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useEffect, useState } from "react"
import { StripePaymentGatewayServiceApi } from "@package/api"

export function StripeProvider({ children }: { children: React.ReactNode }) {
  const [stripePromise, setStripePromise] = useState<any>(null)
  const paymentSrv = new StripePaymentGatewayServiceApi()

  useEffect(() => {
    async function loadStripeConfig() {
      const resp = await paymentSrv.stripePaymentGatewayServiceGetStripeConfig()
      if (resp.data.publishKey) {
        const stripe = await loadStripe(resp.data.publishKey)
        setStripePromise(stripe)
      }
    }
    loadStripeConfig()
  }, [])

  if (!stripePromise) {
    return <div>Loading payment provider...</div>
  }

  return <Elements stripe={stripePromise}>{children}</Elements>
}
