export type CreatePayload<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

export type UpdatePayload<T> = Partial<CreatePayload<T>>
