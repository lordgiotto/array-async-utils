import { ElementOf } from '../utils/typescript';
import type { AsyncMapCallback } from './map';

async function asyncSerialMap<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  ME,
>(array: A, callback: AsyncMapCallback<A, ME>): Promise<ME[]> {
  const results: ME[] = [];
  for (const [index, element] of array.entries()) {
    const callbackResult = await callback(
      element as ElementOf<A>,
      index,
      array
    );
    results.push(callbackResult);
  }
  return results;
}

export { asyncSerialMap };
