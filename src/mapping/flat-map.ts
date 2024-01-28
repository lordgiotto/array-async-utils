import { ElementOf } from '../utils/typescript';

type AsyncFlatMapCallback<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  ME,
> = (
  element: ElementOf<A>,
  index: number,
  array: A
) => Promise<ReadonlyArray<ME> | ME>;

async function asyncFlatMap<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  ME,
>(array: A, callback: AsyncFlatMapCallback<A, ME>): Promise<ME[]> {
  const promisesArray = array.map((el, index) =>
    callback(el as ElementOf<A>, index, array)
  );
  const mappedArray = await Promise.all(promisesArray);
  const flattenArray = mappedArray.flat(1) as ME[];
  return flattenArray;
}

export { asyncFlatMap };
