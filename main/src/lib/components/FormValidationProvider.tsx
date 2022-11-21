import {createContext, ReactNode, useState, useCallback} from 'react';
import {validate as validateField, ValidationRuleName, ValidationRules} from '@umich-michr/validation-functions';
import {WithValidationProps} from '@components/withValidation';
import {createErrorMessages} from '@umich-michr/validation-functions/dist/createErrorMessages';

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
    const validationResult = createErrorMessages(rules)(validateField(rules)(validationValue));
    setErrors((prevErrors) => ({...prevErrors, [fieldName]: validationResult}));
    return validationResult;
  }, []);

  return <FormContext.Provider value={{errors, validate, errorClassName}}>{children}</FormContext.Provider>;
}
export default FormContext;
