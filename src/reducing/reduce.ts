type AsyncReduceCallback<E, I> = (
  accumulator: I,
  element: E,
  index: number,
  array: Array<E> | ReadonlyArray<E>
) => Promise<I>;

// Overload 1: no initial value
async function asyncReduce<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  E = A extends Array<infer T> | ReadonlyArray<infer T> ? T : never,
>(
  array: Array<E> | ReadonlyArray<E>,
  callback: AsyncReduceCallback<E, E>
): Promise<E>;

// Overload 2: initial value same type of elements
async function asyncReduce<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  E = A extends Array<infer T> | ReadonlyArray<infer T> ? T : never,
>(
  array: Array<E> | ReadonlyArray<E>,
  callback: AsyncReduceCallback<E, E>,
  initialValue?: E
): Promise<E>;

// Overload 3: custom initial value
async function asyncReduce<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  I extends unknown,
  E = A extends Array<infer T> | ReadonlyArray<infer T> ? T : never,
>(
  array: Array<E> | ReadonlyArray<E>,
  callback: AsyncReduceCallback<E, I>,
  initialValue?: I
): Promise<I>;

// Implementation
async function asyncReduce<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  I,
  E = A extends Array<infer T> | ReadonlyArray<infer T> ? T : never,
>(
  array: Array<E> | ReadonlyArray<E>,
  callback: AsyncReduceCallback<E, E | I>,
  initialValue?: E | I
): Promise<E | I> {
  const firstElement = array[0]!;
  let accumulator: I | E = initialValue ?? firstElement;
  const startingIndex = typeof initialValue !== 'undefined' ? 0 : 1;
  for (let index = startingIndex; index < array.length; index++) {
    const element = array[index]!;
    accumulator = await callback(accumulator, element, index, array);
  }
  return accumulator;
}

export { asyncReduce };
