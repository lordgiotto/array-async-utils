import { ElementOf } from '../utils/typescript';

type AsyncReduceCallback<A, I> = (
  accumulator: I,
  element: ElementOf<A>,
  index: number,
  array: A
) => Promise<I>;

// Overload 1: no initial value
async function asyncReduce<A extends Array<unknown> | ReadonlyArray<unknown>>(
  array: A,
  callback: AsyncReduceCallback<A, ElementOf<A>>
): Promise<ElementOf<A>>;

// Overload 2: initial value same type of elements
async function asyncReduce<A extends Array<unknown> | ReadonlyArray<unknown>>(
  array: A,
  callback: AsyncReduceCallback<A, ElementOf<A>>,
  initialValue: ElementOf<A>
): Promise<ElementOf<A>>;

// Overload 3: custom initial value
async function asyncReduce<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  I extends unknown,
>(array: A, callback: AsyncReduceCallback<A, I>, initialValue: I): Promise<I>;

// Implementation
async function asyncReduce<
  A extends Array<unknown> | ReadonlyArray<unknown>,
  I,
>(
  array: A,
  callback: AsyncReduceCallback<A, ElementOf<A> | I>,
  initialValue?: ElementOf<A> | I
): Promise<ElementOf<A> | I> {
  const firstElement = array[0] as ElementOf<A>;
  let accumulator: ElementOf<A> | I = initialValue ?? firstElement;
  const startingIndex = typeof initialValue !== 'undefined' ? 0 : 1;
  for (let index = startingIndex; index < array.length; index++) {
    const element = array[index] as ElementOf<A>;
    accumulator = await callback(accumulator, element, index, array);
  }
  return accumulator;
}

export { asyncReduce };
