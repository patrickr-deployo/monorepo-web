export type Nullable<T> = T | null
export type NonNullable<T> = T extends null | undefined ? never : T
export type Optional<T> = T | undefined
export type Recordable<T> = Record<string, T>
export type ReadonlyRecordable<T> = Readonly<Recordable<T>>
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}
export type TimeoutHandle = ReturnType<typeof setTimeout>
export type IntervalHandle = ReturnType<typeof setInterval>
