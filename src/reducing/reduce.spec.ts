import { asyncReduce } from './reduce';

const wait = (time: number) =>
  new Promise((resolve) => setTimeout(() => resolve(undefined), time));

describe('asyncReduce', () => {
  describe("when does't receive an initial value", () => {
    it('should reduce an array into a value of the same type of the elements of the array', async () => {
      const orig = [1, 2, 3];
      const doublesSum: number = await asyncReduce(
        orig,
        async (acc, el) => acc + el * 2
      );
      expect(doublesSum).toEqual(11);
    });
    it('should not allow custom initial value generic', async () => {
      const orig = [1, 2, 3];
      // @ts-expect-error
      const doublesSum = await asyncReduce<typeof orig, number>(
        orig,
        async (acc, el) => acc + el * 2
      );
      expect(doublesSum).toEqual(11);
    });
  });
  describe('when receives an initial value', () => {
    it('should reduce an array into a value of the type of the initial value', async () => {
      const orig = [1, 2, 3];
      const debugString: string = await asyncReduce(
        orig,
        async (acc, el) => `${acc} ${el}`,
        'Elements:'
      );
      const sumFromFive: number = await asyncReduce(
        orig,
        async (acc, el) => acc + el,
        5
      );
      expect(debugString).toEqual('Elements: 1 2 3');
      expect(sumFromFive).toEqual(11);
    });
    it('should allow custom initial value generic', async () => {
      const orig = [5, 6, 7];
      const reducedValue = await asyncReduce<
        typeof orig,
        Record<string, number>
      >(
        orig,
        async (acc, el, index) => ({ ...acc, [`value${index}`]: el }),
        {}
      );
      expect(reducedValue).toEqual({
        value0: 5,
        value1: 6,
        value2: 7,
      });
    });
    it('should throw a typescript error if for initial value generic mismatch', async () => {
      const orig = [1, 2, 3];
      const sumFromOne = await asyncReduce<typeof orig, number[]>(
        orig,
        // @ts-expect-error
        async (acc, el) => acc + el,
        // @ts-expect-error
        1
      );
      expect(sumFromOne).toEqual(7);
    });
  });
  it('should support async code within the predicate', async () => {
    const getUser = async (userId: number) => {
      await wait(5);
      return {
        userId,
      };
    };
    const userIds = [1, 2, 3, 4];
    const usersMap = await asyncReduce(
      userIds,
      async (acc, userId) => {
        const user = await getUser(userId);
        return {
          ...acc,
          [userId]: user,
        };
      },
      {}
    );
    expect(usersMap).toEqual({
      1: { userId: 1 },
      2: { userId: 2 },
      3: { userId: 3 },
      4: { userId: 4 },
    });
  });
  it('should execute callbacks in series', async () => {
    const spyFunction = jest.fn();
    const orig = ['FIRST', 'SECOND', 'THIRD'];
    const mapped = await asyncReduce(
      orig,
      async (acc, el, index) => {
        switch (index) {
          case 0:
            await wait(50);
            break;
          case 1:
            await wait(5);
            break;
          case 2:
            await wait(20);
        }
        spyFunction(el);
        return `${acc} ${el}`;
      },
      'Elements:'
    );
    expect(spyFunction).toHaveBeenCalledTimes(3);
    expect(spyFunction).toHaveBeenNthCalledWith(1, 'FIRST');
    expect(spyFunction).toHaveBeenNthCalledWith(2, 'SECOND');
    expect(spyFunction).toHaveBeenNthCalledWith(3, 'THIRD');
    expect(mapped).toEqual('Elements: FIRST SECOND THIRD');
  });
});
