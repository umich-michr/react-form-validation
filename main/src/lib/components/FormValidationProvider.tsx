import {createContext, ReactNode, useCallback, useState} from 'react';
import {validate as validateField, ValidationRules, ValidationValueType} from '@umich-michr/validation-functions';
import {WithValidationProps} from '@components/withValidation';
import {createErrorMessages} from '@umich-michr/validation-functions/dist/createErrorMessages';
import {Maybe} from '@umich-michr/validation-functions/dist/Maybe';

interface ValidationContext {
  errors: Record<string, string[]>;
  validate: (
    name: string,
    value: ValidationValueType,
    rules: ValidationRules,
    valueSelector: WithValidationProps['valueSelector']
  ) => string[];
  errorClassName?: string;
}

const FormContext = createContext<ValidationContext>({} as ValidationContext);

export function FormValidationProvider({
  errorClassName,
  children
}: {
  errorClassName?: string;
  children: ReactNode | ReactNode[];
}) {
  const [errors, setErrors] = useState({});
  const validate: ValidationContext['validate'] = useCallback((fieldName, value, rules, valueSelector) => {
    const validateValueFn = (val?: typeof value) => createErrorMessages(rules)(validateField(rules)(val));
    const maybeValue = Maybe.of(valueSelector).ap(Maybe.of(value)) as Maybe<typeof value>;
    const validationResult = maybeValue.fork(validateValueFn, validateValueFn);
    setErrors((prevErrors) => ({...prevErrors, [fieldName]: validationResult}));
    return validationResult;
  }, []);

  return <FormContext.Provider value={{errors, validate, errorClassName}}>{children}</FormContext.Provider>;
}
export default FormContext;
