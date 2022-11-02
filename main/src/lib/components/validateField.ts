import {isEmpty, isTooLong, isEmail, ValueValidator} from '@components/validationFunctions';
import {WithValidationProps} from '@components/withValidation';
/*
Validation rule will be passed as JSX property for the component that will be validated within the form.
const exampleValidationRule = {required:{value: true}, maxLength:{value:4}}
*/
export type ValidationRules = {
  // [ruleName: string]: {value: boolean | number};
  email?: {value: boolean};
  maxLength?: {value: number};
  required?: {value: boolean};
};

type ValueValidatorArgs = Parameters<ValueValidator>;
type ValidatorMessageBuilderFn = (...args: ValueValidatorArgs[1][]) => string;

class Validation {
  fn: ValueValidator;
  messageBuilder: ValidatorMessageBuilderFn;
  constructor(fn: ValueValidator, messageBuilder: ValidatorMessageBuilderFn) {
    this.fn = fn;
    this.messageBuilder = messageBuilder;
  }
  run(val: ValueValidatorArgs[0], args: ValueValidatorArgs[1][]) {
    return {
      error: this.fn(val, ...args),
      message: this.messageBuilder(...args)
    };
  }
}

const validations = new Map<string, Validation>();
validations.set(
  'required',
  new Validation(
    (val, ...args) => isEmpty(val, args[0]),
    () => 'Field is required'
  )
);
validations.set(
  'maxLength',
  new Validation(
    (val, ...args) => isTooLong(val, args[0]),
    (...args) => `This value is too long. It should have ${args[0]} characters or fewer.`
  )
);
validations.set(
  'email',
  new Validation(
    (val) => !isEmail(val),
    () => 'This value should be a valid email.'
  )
);

export default function validateField(
  value: string | string[] | undefined | null | [Record<string, string | number>],
  rules: ValidationRules,
  valueSelector: WithValidationProps['valueSelector']
): string[] {
  const fieldErrors: string[] = [];
  let val: string | null | undefined | string[];
  if (valueSelector) {
    if (Array.isArray(value)) {
      val = (value as [Record<string, string | number>])
        .filter((v) => !!valueSelector(v))
        .flatMap((v) => valueSelector(v));
    } else if (value && typeof value !== 'string') {
      val = valueSelector(value);
    } else {
      val = value;
    }
  }
  for (const [ruleName, {value: ruleValue}] of Object.entries(rules)) {
    try {
      const validationResult = validations.get(ruleName)?.run(val, Array.isArray(ruleValue) ? ruleValue : [ruleValue]);
      if (validationResult === undefined) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(`Undefined validation rule, received) ${ruleName}`);
      }
      if (validationResult.error) {
        fieldErrors.push(validationResult.message);
      }
    } catch (ex) {
      fieldErrors.push('Contact support, validation failed because of programming error.');
      if (ex instanceof Error) {
        // eslint-disable-next-line no-console
        console.error(ex.message);
      } else {
        // eslint-disable-next-line no-console
        console.error("Exception thrown is not of type Error so couldn't display err.message", ex);
      }
    }
  }
  return fieldErrors;
}
