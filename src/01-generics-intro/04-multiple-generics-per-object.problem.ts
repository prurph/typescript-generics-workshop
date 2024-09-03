import { expect, it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

const returnBothOfWhatIPassIn = <T, U>(params: { a: T; b: U }) => {
  return {
    first: params.a,
    second: params.b,
  };
};

type Params<T, U> = {
  a: T;
  b: U;
};

const returnBothOfWhatIPassInGenericType = <T, U>(params: Params<T, U>) => {
  return {
    first: params.a,
    second: params.b,
  };
};

it("Should return an object where a -> first and b -> second", () => {
  const result = returnBothOfWhatIPassIn({
    a: "a",
    b: 1,
  });

  expect(result).toEqual({
    first: "a",
    second: 1,
  });

  const resultGenericType = returnBothOfWhatIPassInGenericType({
    a: "a",
    b: 1,
  });

  expect(resultGenericType).toEqual({
    first: "a",
    second: 1,
  });

  type test1 = Expect<
    Equal<
      typeof result,
      {
        first: string;
        second: number;
      }
    >
  >;

  type testGenericType = Expect<
    Equal<
      typeof resultGenericType,
      {
        first: string;
        second: number;
      }
    >
  >;
});
