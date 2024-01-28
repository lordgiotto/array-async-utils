import { asyncFlatMap } from './flat-map';

const wait = (time: number) =>
  new Promise((resolve) => setTimeout(() => resolve(undefined), time));

describe('asyncFlatMap', () => {
  ////////////////////////////////
  //  COMMON MAP TESTS - Start  //
  ////////////////////////////////
  it('should return a copy of the array when an identity callback is provided', async () => {
    const orig = [1, 2, 3];
    const mapped = await asyncFlatMap(orig, async (el) => el);
    expect(mapped).toEqual([1, 2, 3]);
    expect(mapped).not.toBe(orig);
  });
  it('should map an array of numbers into an array of numbers', async () => {
    const orig = [1, 2, 3];
    const mapped = await asyncFlatMap(orig, async (el) => el + 1);
    expect(mapped).toEqual([2, 3, 4]);
  });
  it('should map an array of numbers into an array of strings', async () => {
    const orig = [1, 2, 3];
    const mapped = await asyncFlatMap(
      orig,
      async (el) => `The number is ${el}`
    );
    expect(mapped).toEqual([
      'The number is 1',
      'The number is 2',
      'The number is 3',
    ]);
  });
  it('should map an array of strings into an array of numbers', async () => {
    const orig = ['1', '2', '3'];
    const mapped = await asyncFlatMap(orig, async (el) => parseInt(el, 10));
    expect(mapped).toEqual([1, 2, 3]);
  });
  it('should map an array of arrays into an array of objects', async () => {
    const orig = [
      ['uno', 1],
      ['due', 2],
      ['tre', 3],
    ] as const;
    const mapped = await asyncFlatMap(orig, async (el) => ({ [el[0]]: el[1] }));
    expect(mapped).toEqual([{ uno: 1 }, { due: 2 }, { tre: 3 }]);
  });
  it('should map an array of objects into an array of string', async () => {
    const orig = [
      { name: 'Bob', surname: 'Dylan' },
      { name: 'Ash', surname: 'Ketchum' },
      { name: 'John', surname: 'Doe' },
    ] as const;
    const mapped = await asyncFlatMap(
      orig,
      async ({ name, surname }) => `${name} ${surname}`
    );
    expect(mapped).toEqual(['Bob Dylan', 'Ash Ketchum', 'John Doe']);
  });
  it('should allow customization of types via generics', async () => {
    const orig = [
      { name: 'Bob', surname: 'Dylan' },
      { name: 'Ash', surname: 'Ketchum' },
      { name: 'John', surname: 'Doe' },
    ] as const;
    const mapped = await asyncFlatMap<typeof orig, string>(
      orig,
      async ({ name, surname }) => `${name} ${surname}`
    );
    expect(mapped).toEqual(['Bob Dylan', 'Ash Ketchum', 'John Doe']);
  });
  it('should support async code within the callback', async () => {
    const asyncAction = async (value: number) => {
      await wait(5);
      return `Took ${5 * value}s to map this element`;
    };
    const orig = [1, 2, 3];
    const mapped = await asyncFlatMap(orig, async (el) => {
      const newValue = await asyncAction(el);
      return `${newValue}!`;
    });
    expect(mapped).toEqual([
      'Took 5s to map this element!',
      'Took 10s to map this element!',
      'Took 15s to map this element!',
    ]);
  });
  //////////////////////////////
  //  COMMON MAP TESTS - End  //
  //////////////////////////////

  it('should map an array of arrays into a flat array', async () => {
    const orig = [
      ['uno', 1],
      ['due', 2],
      ['tre', 3],
    ] as const;
    const mapped = await asyncFlatMap(orig, async (el) => [el[0], el[1] + 1]);
    expect(mapped).toEqual(['uno', 2, 'due', 3, 'tre', 4]);
  });
  it('should flat only one level of depth when mapping over arrays', async () => {
    const orig = [
      ['uno', 'due'],
      ['tre', 'quattro'],
      ['cinque', 'sei'],
    ] as const;
    const mapped = await asyncFlatMap(orig, async (el, index) => [
      el[0],
      el[1],
      [`NESTED ${index}`],
    ]);
    expect(mapped).toEqual([
      'uno',
      'due',
      ['NESTED 0'],
      'tre',
      'quattro',
      ['NESTED 1'],
      'cinque',
      'sei',
      ['NESTED 2'],
    ]);
  });
  it('should execute callbacks in parallel', async () => {
    const spyFunction = jest.fn();
    const orig = ['PRIMO', 'SECONDO', 'TERZO'];
    const mapped = await asyncFlatMap(orig, async (el, index) => {
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
      return `${el}!`;
    });
    expect(spyFunction).toHaveBeenCalledTimes(3);
    expect(spyFunction).toHaveBeenNthCalledWith(1, 'SECONDO');
    expect(spyFunction).toHaveBeenNthCalledWith(2, 'TERZO');
    expect(spyFunction).toHaveBeenNthCalledWith(3, 'PRIMO');
    expect(mapped).toEqual(['PRIMO!', 'SECONDO!', 'TERZO!']);
  });
});
