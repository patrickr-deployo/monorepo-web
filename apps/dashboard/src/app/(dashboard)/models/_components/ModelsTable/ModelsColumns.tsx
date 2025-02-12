import { DataTableColumnHeader } from "@package/ui/data-table"
import type { ColumnDef, Row } from "@tanstack/react-table"
import {
  V1beta1Model,
  V1beta1ModelTag,
  V1beta1ModelVersion,
} from "@package/api"
import { ModelTableActions } from "../ModelTableActions/ModelTableActions"
import { Badge } from "@package/ui/badge"
import Link from "next/link"

/**
 * The `getLatestVersion` function returns the latest version from an array of model versions based on
 * their creation dates, while the `getTags` function extracts keys from an array of model tags.
 * @param {V1beta1ModelVersion[]} versions - V1beta1ModelVersion[] - An array of model versions with
 * properties like `createdAt` indicating the creation date of the version.
 * @returns The `getLatestVersion` function returns the latest version from the array of
 * `V1beta1ModelVersion` objects based on the `createdAt` property. The `getTags` function returns an
 * array of keys extracted from the `V1beta1ModelTag` objects.
 */
const getLatestVersion = (versions: V1beta1ModelVersion[]) => {
  return versions.sort(
    (a, b) =>
      new Date(b.createdAt || "").getTime() -
      new Date(a.createdAt || "").getTime()
  )[0]
}

const getTags = (tags: V1beta1ModelTag[]) => {
  return tags.map((tag) => `${tag.key} : ${tag.value}`)
}

/**
 * The `formatDateTime` function in TypeScript React takes a date string, converts it to a formatted
 * date and time string, and returns it.
 * @param {string} date - The `formatDateTime` function takes a date string as input and converts it
 * into a formatted date and time string. The `date` parameter should be a string representing a date
 * and time in a format that can be parsed by the `Date` constructor, such as "YYYY-MM-DDTHH:
 * @returns The `formatDateTime` function takes a string representing a date as input, converts it to a
 * `Date` object, formats it to ISO 8601 format, slices it to include only the date and time up to the
 * minute, and replaces the "T" separator with a space. The function then returns this formatted date
 * and time string.
 */
const formatDateTime = (date: string) => {
  const formattedDate = new Date(date)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ")
  return formattedDate
}

/**
 * This function sorts rows based on the creation date and time in ascending order.
 * @param a - `Row<V1beta1Model>` is a type parameter representing a row of data of type
 * `V1beta1Model`. In this context, `a` and `b` are two rows of data of type `V1beta1Model` that are
 * being compared based on their `createdAt
 * @param b - b is a parameter representing a row of type V1beta1Model in the dateTimeSortingFn
 * function. It is used to compare the createdAt property of two rows for sorting based on their
 * creation dates.
 * @returns The function `dateTimeSortingFn` is returning the result of subtracting the timestamp of
 * the `createdAt` property of row `a` from the timestamp of the `createdAt` property of row `b`. This
 * calculation is done by converting the `createdAt` values to `Date` objects and then getting their
 * respective timestamps using the `getTime()` method.
 */
const dateTimeSortingFn = (a: Row<V1beta1Model>, b: Row<V1beta1Model>) => {
  return (
    new Date(a.original.createdAt || "").getTime() -
    new Date(b.original.createdAt || "").getTime()
  )
}

export const modelColumns: ColumnDef<V1beta1Model>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="ID"
        className="hidden md:table-cell"
      />
    ),
    cell: ({ getValue }) => (
      <div className="hidden md:table-cell">{getValue<string>()}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ getValue }) => getValue<string>(),
  },
  {
    id: "latestVersion",
    accessorFn: (row) => getLatestVersion(row.versions || []),
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Latest Version"
        className="hidden md:table-cell"
      />
    ),
    cell: ({ getValue }) => {
      const latestVersion: V1beta1ModelVersion = getValue<V1beta1ModelVersion>()
      return (
        <div className="hidden md:table-cell">
          <Link
            href={`/models/${latestVersion.modelId}/versions/${latestVersion.id}`}
          >
            <span>v{latestVersion.version}</span>
          </Link>
        </div>
      )
    },
  },
  {
    id: "createdBy",
    accessorFn: (row) => row.versions?.[0]?.createdBy,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created By"
        className="hidden md:table-cell"
      />
    ),
    cell: ({ getValue }) => getValue<string>(),
  },
  {
    accessorKey: "createdAt",
    accessorFn: (row) => formatDateTime(row.createdAt || ""),
    sortingFn: (a, b) => {
      return dateTimeSortingFn(a, b)
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
        className="hidden md:table-cell"
      />
    ),
    cell: ({ getValue }) => (
      <div className="hidden md:table-cell">{getValue<string>()}</div>
    ),
  },
  {
    accessorKey: "updatedAt",
    accessorFn: (row) => formatDateTime(row.updatedAt || ""),
    sortingFn: (a, b) => {
      return dateTimeSortingFn(a, b)
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Last Updated"
        className="hidden md:table-cell"
      />
    ),
    cell: ({ getValue }) => (
      <div className="hidden md:table-cell">{getValue<string>()}</div>
    ),
  },
  {
    id: "tags",
    accessorFn: (row) => getTags(row.tags || []),
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Tags"
        className="hidden md:table-cell"
      />
    ),
    cell: ({ getValue }) => (
      <div className="flex space-x-2">
        {getValue<string[]>().map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const model = row.original

      return (
        <section>
          <ModelTableActions
            model={model}
            onDeleteModelActionClick={() => {}}
          />
        </section>
      )
    },
  },
]
