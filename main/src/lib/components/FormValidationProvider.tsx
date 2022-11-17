import {createContext, ReactNode, useState, useCallback} from 'react';
// import validateField, {ValidationRules} from './validateField';
import {validate as validateField, ValidationRuleName, ValidationRules} from '@umich-michr/validation-functions';
import {WithValidationProps} from '@components/withValidation';

interface ValidationContext {
  errors: Record<string, string[]>;
  validate: (
    name: string,
    value: string | undefined | null,
    rules: ValidationRules,
    valueSelector: WithValidationProps['valueSelector']
  ) => string[];
  errorClassName?: string;
}

const ERROR_MESSAGES = {
  required: () => 'Field is required',
  email: () => 'This value should be a valid email.',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maxLength: (options: any) => `This value is too long. It should have ${options.value} characters or fewer.`
};
const FormContext = createContext<ValidationContext>({errors: {}, validate: () => Array.of<string>()});

export function FormValidationProvider({
  errorClassName,
  children
}: {
  errorClassName?: string;
  children: ReactNode | ReactNode[];
}) {
  const [errors, setErrors] = useState({});
  const validate: ValidationContext['validate'] = useCallback((fieldName, value, rules, valueSelector) => {
    const validationValue = valueSelector ? valueSelector(value) : value;
    const validationResult = validateField(rules)(validationValue).reduceFail(
      (acc: string[], rule: ValidationRuleName) => {
        return acc.concat(ERROR_MESSAGES[rule](rules[rule]));
      },
      []
    ) as string[];
    // const validationResult = validateField(value, rules, valueSelector);
    setErrors((prevErrors) => ({...prevErrors, [fieldName]: validationResult}));
    return validationResult;
  }, []);

  return <FormContext.Provider value={{errors, validate, errorClassName}}>{children}</FormContext.Provider>;
}
export default FormContext;
