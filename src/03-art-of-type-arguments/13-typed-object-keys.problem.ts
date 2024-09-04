import { expect, it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

// One solution: capture type of keys.
const typedObjectKeys = <T extends string>(obj: Record<T, any>) => {
  return Object.keys(obj) as Array<T>;
};

// Second solution: capture type of object and then use `keyof`.
const typedObjectKeys2 = <T extends object>(obj: T) => {
  return Object.keys(obj) as Array<keyof T>;
};

it("Should return the keys of the object", () => {
  const result1 = typedObjectKeys({
    a: 1,
    b: 2,
  });
  const result2 = typedObjectKeys2({
    a: 1,
    b: 2,
  });

  expect(result1).toEqual(["a", "b"]);
  expect(result2).toEqual(["a", "b"]);

  type test = Expect<Equal<typeof result1, Array<"a" | "b">>>;
  type test2 = Expect<Equal<typeof result2, Array<"a" | "b">>>;
});
