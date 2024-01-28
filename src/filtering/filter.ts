import { ElementOf } from '../utils/typescript';

const PREDICATE_NOT_PASSED = Symbol('PREDICATE_NOT_PASSED');

type AsyncFilterPredicate<A> = (
  element: ElementOf<A>,
  index: number,
  array: A
) => Promise<boolean>;

async function asyncFilter<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  FE extends ElementOf<A>,
>(array: A, predicate: AsyncFilterPredicate<A>): Promise<FE[]> {
  const promisesArray = array.map(async (element, index) => {
    const isPredicatePassed = await predicate(
      element as ElementOf<A>,
      index,
      array
    );
    return isPredicatePassed ? (element as FE) : PREDICATE_NOT_PASSED;
  });
  const mappedElements = await Promise.all(promisesArray);
  return mappedElements.filter(
    <T>(element: T): element is Exclude<T, typeof PREDICATE_NOT_PASSED> =>
      element !== PREDICATE_NOT_PASSED
  );
}

export { asyncFilter };
export type { AsyncFilterPredicate };
