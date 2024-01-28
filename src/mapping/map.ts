type AsyncMapCallback<E, ME> = (
  element: E,
  index: number,
  array: Array<E> | ReadonlyArray<E>
) => Promise<ME>;

async function asyncMap<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  ME,
  E = A extends Array<infer T> | ReadonlyArray<infer T> ? T : never,
>(
  array: Array<E> | ReadonlyArray<E>,
  callback: AsyncMapCallback<E, ME>
): Promise<ME[]> {
  const promisesArray = array.map(callback);
  return Promise.all(promisesArray);
}

export { asyncMap, AsyncMapCallback };
