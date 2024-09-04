import { it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

function returnWhatIPassInExceptFor1(t: 1): 2;
function returnWhatIPassInExceptFor1<T>(t: T): T;
// You could use a generic here, but MP prefers unknown/unknown to convey
// we don't know what's going to be passed in. Further, it exemplifies that
// generics can be added to just some overloads to capture types.
function returnWhatIPassInExceptFor1(t: unknown): unknown {
  if (t === 1) {
    return 2;
  }
  return t;
}

it("Should return the type 2 when you pass in 1", () => {
  const result = returnWhatIPassInExceptFor1(1);

  type test1 = Expect<Equal<typeof result, 2>>;
});

it("Otherwise, should return what you pass in", () => {
  const a = returnWhatIPassInExceptFor1("a");
  const b = returnWhatIPassInExceptFor1("b");
  const c = returnWhatIPassInExceptFor1("c");

  type tests = [
    Expect<Equal<typeof a, "a">>,
    Expect<Equal<typeof b, "b">>,
    Expect<Equal<typeof c, "c">>
  ];
});
