import {
  ComponentPropsWithRef,
  ElementType,
  FormEvent,
  ForwardedRef,
  forwardRef,
  RefObject,
  useContext,
  useImperativeHandle,
  useRef
} from 'react';
import Error from './Error';
import FormContext from './FormValidationProvider';
import {ValidationRules} from '@umich-michr/validation-functions';

export interface WithValidationProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueSelector?: (val: any) => any;
  dataValidationRules: ValidationRules;
  onChange?: (params: unknown) => unknown;
}
type PropType = WithValidationProps & {value?: string; getValue?: () => string};

export default function withValidation<T extends ElementType>(Component: T | string) {
  const ValidatedComponent = forwardRef(
    (
      {name, dataValidationRules, valueSelector, onChange, ...props}: ComponentPropsWithRef<T> & PropType,
      ref: ForwardedRef<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        element: RefObject<any>;
        validate: (e: FormEvent<HTMLInputElement>) => void;
      }>
    ) => {
      const element = useRef<PropType>({} as PropType);

      const {errors, validate, errorClassName} = useContext(FormContext);
      const validateField = () => {
        let elementValue;
        if ('value' in element.current) {
          elementValue = element.current.value;
        } else if (element.current.getValue) {
          elementValue = element.current.getValue();
        }
        return validate(name, elementValue, dataValidationRules, valueSelector);
      };

      const handleChange = (e: FormEvent<HTMLInputElement> & {value?: string}) => {
        let elementValue;
        if ('value' in e) {
          elementValue = e.value;
        } else if (e.currentTarget && 'value' in e.currentTarget) {
          elementValue = e.currentTarget.value;
        }
        if (onChange) {
          onChange();
        }
        return validate(name, elementValue, dataValidationRules, valueSelector);
      };

      useImperativeHandle(ref, () => ({
        element,
        validate: validateField
      }));

      return (
        <>
          <Component name={name} ref={element} onChange={handleChange} {...props} />
          <Error name={name} errors={errors} errorClass={errorClassName} />
        </>
      );
    }
  );

  ValidatedComponent.displayName = 'ValidatedComponent';
  return ValidatedComponent;
}
