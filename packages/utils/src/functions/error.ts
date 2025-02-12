export function catchErrorTyped<T, E extends new (message?: string) => Error>(
  promise: Promise<T>,
  errorsToCatch?: E[]
): Promise<[undefined, T] | [InstanceType<E>]> {
  return promise
    .then<[undefined, T]>((data) => [undefined, data])
    .catch<[InstanceType<E>]>((error) => {
      if (!errorsToCatch) {
        return [error]
      }

      if (errorsToCatch.some((e) => error instanceof e)) {
        return [error]
      }

      throw error
    })
}
