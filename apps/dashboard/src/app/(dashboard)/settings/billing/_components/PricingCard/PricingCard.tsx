import { Card, CardContent, CardHeader } from "@package/ui/card"
import { Typography } from "@package/ui/typography"
import { Button } from "@package/ui/button"
import { Badge } from "@package/ui/badge"
import { cn } from "@package/utils"
import type { V1Plan, V1Price } from "@package/api"

type PricingCardProps = {
  plan: { plan: V1Plan; price: V1Price }
  isLoading: boolean
  onSubscribe: () => void
}

export function PricingCard({
  plan,
  isLoading,
  onSubscribe,
}: PricingCardProps) {
  const isPopular = plan.plan.displayName === "PRO"
  const price = plan.price

  return (
    <Card
      className={cn("relative", {
        "border-2 border-primary": isPopular,
      })}
    >
      {isPopular && (
        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
          Popular
        </Badge>
      )}
      <CardHeader>
        <Typography variant="h3">{plan.plan.displayName}</Typography>
        <Typography className="text-muted-foreground">
          {plan.plan.key}
        </Typography>
        <div className="mt-4">
          <Typography className="text-4xl font-bold">
            ${price.default?.text}
            <span className="text-base font-normal text-muted-foreground">
              /{price.recurring?.interval}
            </span>
          </Typography>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          onClick={onSubscribe}
          disabled={isLoading}
          isLoading
        >
          Subscribe
        </Button>
      </CardContent>
    </Card>
  )
}
