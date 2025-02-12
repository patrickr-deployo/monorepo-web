import { DataTable } from "@package/ui/data-table"
import { modelColumns } from "./ModelsColumns"
import { V1beta1Model } from "@package/api"

export function ModelsTable({ models }: { models: V1beta1Model[] }) {
  return (
    <DataTable
      columnToggle
      showPagination
      columns={modelColumns}
      data={models || []}
      initialState={{
        columnVisibility: {
          id: false,
          createdAt: false,
        },
      }}
    />
  )
}
