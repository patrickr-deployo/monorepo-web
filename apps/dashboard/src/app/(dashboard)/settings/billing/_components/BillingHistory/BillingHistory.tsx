import { Card, CardContent, CardHeader } from "@package/ui/card"
import { Typography } from "@package/ui/typography"
import { DataTable } from "@package/ui/data-table"

export function BillingHistory() {
  return (
    <section>
      <Card>
        <CardHeader>
          <Typography variant="h2">Billing History</Typography>
          <Typography variant="body" className="text-sm text-muted-foreground">
            View your billing history and download invoices
          </Typography>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              {
                accessorKey: "date",
                header: "Date",
              },
              {
                accessorKey: "amount",
                header: "Amount",
              },
              {
                accessorKey: "status",
                header: "Status",
              },
              {
                accessorKey: "invoice",
                header: "Invoice",
              },
            ]}
            data={[]} // TODO: Add real billing history data
            showPagination
          />
        </CardContent>
      </Card>
    </section>
  )
}
