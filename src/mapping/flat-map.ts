import type { AsyncMapCallback } from './map';

async function asyncFlatMap<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  ME,
  E = A extends Array<infer T> | ReadonlyArray<infer T> ? T : never,
>(array: Array<E> | ReadonlyArray<E>, callback: AsyncMapCallback<E, ME>) {
  const promisesArray = array.map(callback);
  const mappedArray = await Promise.all(promisesArray);
  return mappedArray.flat(1);
}

export { asyncFlatMap };
