import { expect, it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

const array = [
  {
    name: "John",
  },
  {
    name: "Steve",
  },
];

// Other options:
// - Annotate `accum` parameter to reduce function argument
// - Specify accumulator argument like `{} as Record<string, { name: string }>`
// Matt Pocock prefers the featured solution: type annotation on .reduce
const obj = array.reduce<Record<string, { name: string }>>((accum, item) => {
  accum[item.name] = item;
  return accum;
}, {});

it("Should resolve to an object where name is the key", () => {
  expect(obj).toEqual({
    John: {
      name: "John",
    },
    Steve: {
      name: "Steve",
    },
  });

  type tests = [Expect<Equal<typeof obj, Record<string, { name: string }>>>];
});
