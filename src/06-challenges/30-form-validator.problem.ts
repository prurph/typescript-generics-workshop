import { expect, it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

// Need TValidatorKey to capture the actual keys of the validators (so can't specify
// validators that don't exist).
// Need TProps to capture keys of config (so can't specify object properties that
// don't exist)
// Also possible to capture entire type of validators, however since the value type
// for that object is always (value: string) => string | void and we only care about
// the keys, (because the config is TProps: Array<TValidatorKey>), it's cleaner to do this.
// I got this one all by myself and I'm super proud of it 💪🚀!
const makeFormValidatorFactory =
  <TValidatorKey extends PropertyKey>(
    validators: Record<TValidatorKey, (value: string) => string | void>
  ) =>
  <TProps extends PropertyKey>(
    config: Record<TProps, Array<TValidatorKey>>
  ) => {
    return (values: Record<TProps, string>) => {
      const errors = {} as Record<TProps, string | undefined>;

      for (const key in config) {
        for (const validator of config[key]) {
          const error = validators[validator](values[key]);
          if (error) {
            errors[key] = error;
            break;
          }
        }
      }

      return errors;
    };
  };

const createFormValidator = makeFormValidatorFactory({
  required: (value) => {
    if (value === "") {
      return "Required";
    }
  },
  minLength: (value) => {
    if (value.length < 5) {
      return "Minimum length is 5";
    }
  },
  email: (value) => {
    if (!value.includes("@")) {
      return "Invalid email";
    }
  },
});

const validateUser = createFormValidator({
  id: ["required"],
  username: ["required", "minLength"],
  email: ["required", "email"],
});

it("Should properly validate a user", () => {
  const errors = validateUser({
    id: "1",
    username: "john",
    email: "Blah",
  });

  expect(errors).toEqual({
    username: "Minimum length is 5",
    email: "Invalid email",
  });

  type test = Expect<
    Equal<
      typeof errors,
      {
        id: string | undefined;
        username: string | undefined;
        email: string | undefined;
      }
    >
  >;
});

it("Should not allow you to specify a validator that does not exist", () => {
  createFormValidator({
    // @ts-expect-error
    id: ["i-do-not-exist"],
  });
});

it("Should not allow you to validate an object property that does not exist", () => {
  const validator = createFormValidator({
    id: ["required"],
  });

  validator({
    // @ts-expect-error
    name: "123",
  });
});
