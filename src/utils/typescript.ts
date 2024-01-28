export type ElementOf<T> = T extends Array<infer E> | ReadonlyArray<infer E>
  ? E
  : never;
