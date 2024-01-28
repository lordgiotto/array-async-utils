import type { AsyncMapCallback } from './map';

async function asyncSerialMap<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  ME,
  E = A extends Array<infer T> | ReadonlyArray<infer T> ? T : never,
>(
  array: Array<E> | ReadonlyArray<E>,
  callback: AsyncMapCallback<E, ME>
): Promise<ME[]> {
  const results: ME[] = [];
  for (const [index, element] of array.entries()) {
    const callbackResult = await callback(element, index, array);
    results.push(callbackResult);
  }
  return results;
}

export { asyncSerialMap };
