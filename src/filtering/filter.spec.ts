import { asyncFilter } from './filter';

const wait = (time: number) =>
  new Promise((resolve) => setTimeout(() => resolve(undefined), time));

describe('asyncFilter', () => {
  it('should remove an element from the array according to the predicate', async () => {
    const orig = [1, 2, 3] as const;
    const filtered = await asyncFilter(orig, async (el) => el !== 2);
    expect(filtered).toEqual([1, 3]);
  });
  it('should remove falsy values according to the predicate', async () => {
    const orig = [1, 2, null, false, '', 3, undefined];
    const filtered = await asyncFilter(orig, async (el) => !!el);
    expect(filtered).toEqual([1, 2, 3]);
  });
  it('should remove truthy values according to the predicate', async () => {
    const orig = [1, 2, null, false, '', 3, undefined];
    const filtered = await asyncFilter(orig, async (el) => !el);
    expect(filtered).toEqual([null, false, '', undefined]);
  });
  it('should allow type narrowing via generics', async () => {
    const orig = [1, 2, 3] as const;
    const filtered = await asyncFilter<typeof orig, 1 | 3>(
      orig,
      async (el) => el !== 2
    );
    expect(filtered).toEqual([1, 3]);
  });
  it('should throw a typescript error if type narrowing via generics does not extend original array type', async () => {
    const orig = [1, 2, 3] as const;
    // @ts-expect-error
    const filtered = await asyncFilter<typeof orig, 1 | 3 | 4>(
      orig,
      async (el) => el !== 2
    );
    expect(filtered).toEqual([1, 3]);
  });
  it('should support async code within the predicate', async () => {
    const asyncAction = async (value: number) => {
      await wait(5);
      return value % 2 == 0;
    };
    const orig = [1, 2, 3, 4];
    const mapped = await asyncFilter(orig, async (el) => {
      const isEven = await asyncAction(el);
      return isEven;
    });
    expect(mapped).toEqual([2, 4]);
  });
  it('should execute callbacks in parallel', async () => {
    const spyFunction = jest.fn();
    const orig = ['FIRST', 'SECOND', 'THIRD'];
    const mapped = await asyncFilter(orig, async (el, index) => {
      let include = false;
      switch (index) {
        case 0:
          await wait(50);
          include = true;
          break;
        case 1:
          await wait(5);
          include = false;
          break;
        case 2:
          await wait(20);
          include = false;
          break;
      }
      spyFunction(el);
      return include;
    });
    expect(spyFunction).toHaveBeenCalledTimes(3);
    expect(spyFunction).toHaveBeenNthCalledWith(1, 'SECOND');
    expect(spyFunction).toHaveBeenNthCalledWith(2, 'THIRD');
    expect(spyFunction).toHaveBeenNthCalledWith(3, 'FIRST');
    expect(mapped).toEqual(['FIRST']);
  });
});
