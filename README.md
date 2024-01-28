<h1>Array Async Utils</h1>

- [Mapping](#mapping)
  - [asyncMap](#asyncmap)
    - [Usage](#usage)
    - [Specify mapped element type](#specify-mapped-element-type)
  - [asyncSerialMap](#asyncserialmap)
    - [Usage](#usage-1)
    - [Specify mapped element type](#specify-mapped-element-type-1)

## Mapping

### asyncMap

#### Usage

```ts
import { asyncMap } from 'array-async-utils';

import { getUser } from 'apis/user';

const yourFunction = async () => {
  const userIds = ['92f9e7a1', '59ef0d84', '6b6cafba'];
  const users = await asyncMap(userIds, async (userId) => {;
    const { user } = await getUser(userId);
    return user;
  });
};
```

#### Specify mapped element type

```ts
// ...
const array = [1, 2, 3];
const mappedArray = await asyncMap<typeof array, MappedElement>(
  partialIDs,
  async (partialID) => {
    // ...
  }
);
// ^^^ mappedArray is of type MappedElement[]
```

### asyncSerialMap

#### Usage

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

#### Specify mapped element type

```ts
// ...
const array = [1, 2, 3];
const mappedArray = await asyncMap<typeof array, MappedElement>(
  partialIDs,
  async (partialID) => {
    // ...
  }
);
// ^^^ mappedArray is of type MappedElement[]
```
