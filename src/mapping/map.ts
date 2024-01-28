import { ElementOf } from '../utils/typescript';

type AsyncMapCallback<A extends Array<unknown> | ReadonlyArray<unknown>, ME> = (
  element: ElementOf<A>,
  index: number,
  array: A
) => Promise<ME>;

async function asyncMap<A extends Array<unknown> | ReadonlyArray<unknown>, ME>(
  array: A,
  callback: AsyncMapCallback<A, ME>
): Promise<ME[]> {
  const promisesArray = array.map((el, index) =>
    callback(el as ElementOf<A>, index, array)
  );
  return Promise.all(promisesArray);
}

export { asyncMap, AsyncMapCallback };
