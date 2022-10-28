import {createContext, ReactNode, useState, useCallback} from 'react';
import validateField, {ValidationRules} from './validateField';
import {WithValidationProps} from '@components/withValidation';

interface ValidationContext {
  errors: Record<string, string[]>;
  validate: (
    name: string,
    value: string[] | string | undefined | null,
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
    const validationResult = validateField(value, rules, valueSelector);
    setErrors((prevErrors) => ({...prevErrors, [fieldName]: validationResult}));
    return validationResult;
  }, []);

  return <FormContext.Provider value={{errors, validate, errorClassName}}>{children}</FormContext.Provider>;
}
export default FormContext;
