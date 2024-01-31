<h1>Array Async Utils</h1>

Small set of utility functions to perform async array mapping, filtering and reducing.

- [How to install](#how-to-install)
- [Usage](#usage)
  - [asyncMap](#asyncmap)
    - [Specify mapped element type](#specify-mapped-element-type)
  - [asyncSerialMap](#asyncserialmap)
    - [Specify mapped element type](#specify-mapped-element-type-1)
  - [asyncFlatMap](#asyncflatmap)
    - [Specify mapped element type](#specify-mapped-element-type-2)
  - [asyncFilter](#asyncfilter)
    - [Filtered array type narrowing](#filtered-array-type-narrowing)
  - [asyncReduce](#asyncreduce)
    - [Specify initialValue/accumulator and reduced value type](#specify-initialvalueaccumulator-and-reduced-value-type)

## How to install

```
  npm install array-async-utils
```

or

```
  yarn add array-async-utils
```

## Usage

These funcitons accepts the input array as first paramenter, while the arguments, types and returned value resemble as much as possible the ones of the equivalent Array method.

### asyncMap

Same behaviour as Array.map, but supports an async callback: all async callbacks are executed in parallel.

If one callback throws an error, the whole map function throws as well.

```ts
import { asyncMap } from 'array-async-utils';

import { getUser } from 'apis/user';

const yourFunction = async () => {
  const userIds = ['92f9e7a1', '59ef0d84', '6b6cafba'];
  const users = await asyncMap(userIds, async (userId) => {
    const { user } = await getUser(userId);
    return user;
  });
};
```

##### Specify mapped element type

```ts
// ...
const array = [1, 2, 3];
const mappedArray = await asyncMap<typeof array, MappedElement>(
  array,
  async (element) => {
    // ...
  }
);
// ^^^ callback will expect Promise<MappedElement> return type, and mappedArray will be of type MappedElement[]
```

### asyncSerialMap

Same as `asyncMap`, but async callbacks are executed in series: each one is executed when the previous is finished.

Even if not common, it can be useful when some rece condition might happen in the async callback.

If one callback throws an error, the whole map function throws as well.

```ts
import { asyncSerialMap } from 'array-async-utils';

import { getUser } from 'apis/user';
import { userCache } from 'cache/user';

const yourFunction = async () => {
  const userIds = ['92f9e7a1', '59ef0d84', '6b6cafba'];
  const users = await asyncSerialMap(userIds, async (userId) => {
    const cachedUser = userCache.get(userId);
    if (cachedUser) {
      return cachedUser;
    }
    const { user } = await getUser(userId);
    cachedUser.set(userId, user);
    return user;
  });
};
```

##### Specify mapped element type

```ts
// ...
const array = [1, 2, 3];
const mappedArray = await asyncMap<typeof array, MappedElement>(
  array,
  async (element) => {
    // ...
  }
);
// ^^^ callback will expect Promise<MappedElement> return type, and mappedArray will be of type MappedElement[]
```

### asyncFlatMap

Same behaviour as Array.flatMap, but supports an async callback: all async callbacks are executed in parallel.

If one callback throws an error, the whole map function throws as well.

```ts
import { asyncFlatMap } from 'array-async-utils';

import { getUsersByGroup } from 'apis/user';

const yourFunction = async () => {
  const userGroups = ['groupA', 'groupB', 'groupC'];
  const users = await asyncFlatMap(userIds, async (userId) => {
    const { groupUsers } = await getUsersByGroup(userId);
    return groupUsers;
  });
};
```

##### Specify mapped element type

```ts
// ...
const array = [1, 2, 3];
const mappedArray = await asyncFlatMap<typeof array, MappedElement>(
  array,
  async (element) => {
    // ...
  }
);
// ^^^ callback will expect Promise<MappedElement | MappedElement[]> return type, and mappedArray will be of type MappedElement[]
```

### asyncFilter

Same behaviour as Array.filter, but supports an async predicate: all async predicates are executed in parallel.

If one callback throws an error, the whole filter function throws as well.

> IMPORTANT: unfortunately typescript doesn't support type guards with async function, so if you need to narrow down the type of the filtered array, please use the generics as described below

```ts
import { asyncFilter } from 'array-async-utils';

import { getUserStatus } from 'apis/user';

const yourFunction = async () => {
  const userIds = ['asyncFilter', '59ef0d84', '6b6cafba'];
  const users = await asyncFilter(userIds, async (userId) => {
    const { isOnline } = await getUserStatus(userId);
    return isOnline;
  });
};
```

##### Filtered array type narrowing

```ts
// ...
const array = [1, 2, 3, undefined];
const filteredArray = await asyncFilter<typeof array, number>(
  array,
  async (element) => {
    // ...
  }
);
// ^^^ filteredArray will be of type number[]
```

### asyncReduce

Same behaviour as Array.reduce, but supports an async callback. Async callbacks are executed in series: each one is executed when the previous is finished.

If one callback throws an error, the whole map function throws as well.

```ts
import { asyncReduce } from 'array-async-utils';

import { getArticleStats } from 'apis/user';

const yourFunction = async () => {
  const articleIds = ['92f9e7a1', '59ef0d84', '6b6cafba'];
  const totalInteractions = await asyncReduce(
    articleIds,
    async (accumulator, articleId) => {
      const { articleInteractions } = getArticleStats(articleId);
      return accumulator + articleInteractions;
    },
    0
  );
};
```

##### Specify initialValue/accumulator and reduced value type

```ts
// ...
const array = [1, 2, 3];
const reducedValue = await asyncReduce<typeof array, Record<string, number>>(
  array,
  async (accumulator, element) => {
    // ...
  },
  {}
);
// ^^^ callback will expect Promise<Record<string, number>> return type;
// initialValue, accumulator and reducedValue will be of type Record<string, number>.
```
