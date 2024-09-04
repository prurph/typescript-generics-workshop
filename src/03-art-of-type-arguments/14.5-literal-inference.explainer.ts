// When returning the value only, it infers
// the literal type
const returnsValueOnly = <T>(t: T) => {
  return t;
};

const result = returnsValueOnly("a");
//    ^? const result: "a"

// When returning an object or array, it doesn't infer the
// literal type
const returnsValueInAnObject = <T1>(t: T1) => {
  return {
    t,
  };
};

const result2 = returnsValueInAnObject("abc");
//    ^? const result2: { t: string; }

// With a constraint, it narrows it to its literal
const returnsValueInAnObjectWithConstraint = <T1 extends string>(t: T1) => {
  return {
    t,
  };
};

const result3 = returnsValueInAnObjectWithConstraint("abc");
//    ^? const result3: { t: "abc"; }

export {};
