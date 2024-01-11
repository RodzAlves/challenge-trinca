export type ReturnActionType<T> =
  | null
  | void
  | (Partial<T> & { error?: string })
