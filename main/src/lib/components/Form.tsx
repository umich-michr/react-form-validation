import {ComponentElement, FormEvent, ReactNode} from 'react';
import {FormValidationProvider} from './FormValidationProvider';
import FormValidator from './FormValidator';

export default function Form(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (ReactNode | ComponentElement<any, any>)[];
  errorClassName?: string;
  id?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const {errorClassName, children, ...formProps} = props;
  return (
    <FormValidationProvider errorClassName={errorClassName}>
      <FormValidator {...formProps}>{children}</FormValidator>
    </FormValidationProvider>
  );
}
