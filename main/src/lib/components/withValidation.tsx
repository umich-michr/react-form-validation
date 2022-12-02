import {
  ComponentPropsWithRef,
  ElementType,
  FormEvent,
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  RefObject,
  useContext,
  useImperativeHandle,
  useRef
} from 'react';
import Error from './Error';
import FormContext from './FormValidationProvider';
import {ValidationRules, ValidationValueType} from '@umich-michr/validation-functions';
import {StateManagerProps} from 'react-select/dist/declarations/src/stateManager';

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

      //TODO: 12-01-2022 - vijay & mel: refactor the branching logic (avoid if/else) depending on the html element type.
      const validateField = () => {
        let elementValue;
        if ('selectedOptions' in element.current) {
          //single or multiple html select element
          const selectedValues = Array.from(
            element.current.selectedOptions as HTMLCollection,
            (o) => (o as HTMLOptionElement).value
          ) as Array<string>;
          elementValue = selectedValues.includes('') ? [] : selectedValues;
        } else if ('value' in element.current) {
          elementValue = element.current.value;
        } else if (element.current.getValue) {
          elementValue = element.current.getValue();
        }
        return validate(name, elementValue, dataValidationRules, valueSelector);
      };

      //TODO: 12-01-2022 - vijay & mel: refactor the branching logic (avoid if/else) depending on the html element type.
      const handleChange = (elementValue: ValidationValueType) => {
        if (onChange) {
          onChange();
        }
        return validate(name, elementValue, dataValidationRules, valueSelector);
      };

      function getInputValue<T extends {value?: string}>(
        e: FormEvent<HTMLInputElement> | T,
        element: MutableRefObject<PropType>
      ) {
        let elementValue;
        if ('currentTarget' in e) {
          if ('selectedOptions' in e.currentTarget) {
            //single or multiple html select element
            const selectedValues = Array.from(
              e.currentTarget.selectedOptions as HTMLCollection,
              (o) => (o as HTMLOptionElement).value
            ) as Array<string>;
            elementValue = selectedValues.includes('') ? [] : selectedValues;
          } else {
            elementValue = e.currentTarget.value;
          }
        } else if (element.current.getValue) {
          if (
            'props' in element.current &&
            'isMulti' in (element.current.props as StateManagerProps) &&
            !(element.current.props as StateManagerProps).isMulti
          ) {
            elementValue = [e];
          } else {
            elementValue = e;
          }
        }
        return elementValue as ValidationValueType;
      }

      useImperativeHandle(ref, () => ({
        element,
        validate: validateField
      }));

      return (
        <>
          <Component
            name={name}
            ref={element}
            onChange={(e: FormEvent<HTMLInputElement>) => {
              handleChange(getInputValue(e, element));
            }}
            {...props}
          />
          <Error name={name} errors={errors} errorClass={errorClassName} />
        </>
      );
    }
  );

  ValidatedComponent.displayName = 'ValidatedComponent';
  return ValidatedComponent;
}
