export type WithId<T, K extends PropertyKey> = T & { [P in K]: PropertyKey };

export type Nullable<T> = T | null | undefined;
