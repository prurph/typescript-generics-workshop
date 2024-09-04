import { expect, it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

// Function overload solution
function runGeneratorOverload<T>(generator: () => T): T;
function runGeneratorOverload<T>(generator: { run: () => T }): T;
function runGeneratorOverload<T>(generator: (() => T) | { run: () => T }) {
  if (typeof generator === "function") {
    return generator();
  }
  return generator.run();
}
// Direct union type solution: there's no need for the function overload here,
// because the return type is the same for all types of parameters.
function runGeneratorUnion<T>(generator: (() => T) | { run: () => T }) {
  if (typeof generator === "function") {
    return generator();
  }
  return generator.run();
}

it("Should accept an object where the generator is a function", () => {
  const result = runGeneratorOverload({
    run: () => "hello",
  });
  const result2 = runGeneratorUnion({
    run: () => "hello",
  });

  expect(result).toBe("hello");
  expect(result2).toBe("hello");

  type test1 = Expect<Equal<typeof result, string>>;
  type test2 = Expect<Equal<typeof result2, string>>;
});

it("Should accept an object where the generator is a function", () => {
  const result = runGeneratorOverload(() => "hello");
  const result2 = runGeneratorUnion(() => "hello");

  expect(result).toBe("hello");
  expect(result2).toBe("hello");

  type test1 = Expect<Equal<typeof result, string>>;
  type test2 = Expect<Equal<typeof result2, string>>;
});
