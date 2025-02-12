"use client"

import { useState, useEffect } from "react"
import { useStripe, PaymentElement } from "@stripe/react-stripe-js"
import {
  CheckoutServiceApi,
  type V1Plan,
  type V1Price,
  type StripePaymentIntent,
} from "@package/api"
import { toast } from "@package/ui/toast"
import { Button } from "@package/ui/button"
import { Switch } from "@package/ui/switch"
import { Label } from "@package/ui/label"
import { PricingCard } from "../PricingCard/PricingCard"

type PricingPlansProps = {
  data: Map<string, Array<{ plan: V1Plan; price: V1Price }>>
  currentPeriod: string
  onPeriodChange: (value: string) => void
}

export function PricingPlans({
  data,
  currentPeriod,
  onPeriodChange,
}: PricingPlansProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<{
    plan: V1Plan
    price: V1Price
  }>()
  const [paymentIntent, setPaymentIntent] = useState<StripePaymentIntent>()
  const stripe = useStripe()
  const checkoutSrv = new CheckoutServiceApi()

  useEffect(() => {
    if (!paymentIntent) return
    if (paymentIntent.status === "succeeded") {
      toast({
        title: "Success",
        description: "Payment successful",
      })
    }
  }, [paymentIntent])

  if (paymentIntent?.clientSecret) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <PaymentElement id="payment-element" />
        <Button
          className="w-full"
          onClick={async (e) => {
            e.preventDefault()
            if (!stripe) return

            setIsLoading(true)
            const { error } = await stripe.confirmPayment({
              elements: undefined,
              clientSecret: paymentIntent.clientSecret!,
              confirmParams: {
                return_url: window.location.href,
              },
            })

            if (error) {
              toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
              })
            }
            setIsLoading(false)
          }}
          disabled={isLoading}
          isLoading
        >
          Pay Now
        </Button>
      </div>
    )
  }

  const handleSubscribe = async (plan: { plan: V1Plan; price: V1Price }) => {
    try {
      setIsLoading(true)
      setCurrentPrice(plan)

      const resp = await checkoutSrv.checkoutServiceCheckoutNow({
        body: {
          provider: "stripe",
          items: [
            {
              priceId: plan.price.id,
              quantity: "1",
            },
          ],
        },
      })

      const intent =
        resp.data.subscription?.providerInfo?.stripe?.subscription
          ?.latestInvoice?.paymentIntent ||
        resp.data.order?.paymentProviderInfo?.stripe?.paymentIntent

      if (!intent?.clientSecret) {
        throw new Error("Failed to create payment intent")
      }

      setPaymentIntent(intent)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          <Label htmlFor="billing-period">Monthly</Label>
          <Switch
            id="billing-period"
            checked={currentPeriod === "yearly"}
            onCheckedChange={(checked) =>
              onPeriodChange(checked ? "yearly" : "monthly")
            }
          />
          <Label htmlFor="billing-period">Yearly</Label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(data.get(currentPeriod) ?? []).map((plan) => (
          <PricingCard
            key={plan.plan.key}
            plan={plan}
            isLoading={isLoading && currentPrice?.plan.key === plan.plan.key}
            onSubscribe={() => handleSubscribe(plan)}
          />
        ))}
      </div>
    </div>
  )
}
