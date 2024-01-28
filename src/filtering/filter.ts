// async function asyncFilter<E, FE extends E>(
//   array: Array<E> | ReadonlyArray<E>,
//   predicate: AsyncFilterPredicate<E>
// ): Promise<FE[]> {
//   const promisesArray = array.map(async (element, index, mappedArray) => {
//     const isPredicatePassed = await predicate(element, index, mappedArray);
//     return isPredicatePassed ? (element as FE) : PREDICATE_NOT_PASSED;
//   });
//   const mappedElements = await Promise.all(promisesArray);
//   return mappedElements.filter(
//     <T>(element: T): element is Exclude<T, typeof PREDICATE_NOT_PASSED> =>
//       element !== PREDICATE_NOT_PASSED
//   );
// }

const PREDICATE_NOT_PASSED = Symbol('PREDICATE_NOT_PASSED');

type AsyncFilterPredicate<E> = (
  element: E,
  index: number,
  array: ReadonlyArray<E>
) => Promise<boolean>;

async function asyncFilter<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  FE extends E,
  E = A extends Array<infer T> | ReadonlyArray<infer T> ? T : never,
>(
  array: Array<E> | ReadonlyArray<E>,
  predicate: AsyncFilterPredicate<E>
): Promise<FE[]> {
  const promisesArray = array.map(async (element, index, mappedArray) => {
    const isPredicatePassed = await predicate(element, index, mappedArray);
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
