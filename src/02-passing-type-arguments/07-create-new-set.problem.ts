import { Equal, Expect } from "../helpers/type-utils";

// Alternate solution is explicit return type of Set<T>
// and then you can just `return new Set()` without
// explicit type.
export const createSet = <T>() => {
  return new Set<T>();
};

const stringSet = createSet<string>();
const numberSet = createSet<number>();
const unknownSet = createSet();

type tests = [
  Expect<Equal<typeof stringSet, Set<string>>>,
  Expect<Equal<typeof numberSet, Set<number>>>,
  Expect<Equal<typeof unknownSet, Set<unknown>>>
];
