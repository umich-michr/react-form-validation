/* eslint-disable @typescript-eslint/no-explicit-any */
import {ComponentElement, FormEvent, ReactNode} from 'react';

export default function FormValidator(props: {
  children: (ReactNode | ComponentElement<any, any>)[];
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const localErrors = new Map<string, string[]>();

  function validateChild(child: ReactNode | ComponentElement<any, any>) {
    const childElement =
      child &&
      typeof child !== 'string' &&
      typeof child !== 'number' &&
      typeof child !== 'boolean' &&
      'props' in child &&
      child.props;
    if (childElement) {
      if (
        'ref' in child &&
        typeof child.ref !== 'string' &&
        child.ref &&
        'current' in child.ref &&
        'validate' in child.ref.current
      ) {
        const validationResult = child.ref.current.validate();
        localErrors.set(child.props.name, validationResult);
      }
      if (child.props.children && Array.isArray(child.props.children)) {
        child.props.children.forEach((grandChild: ComponentElement<any, any>) => {
          validateChild(grandChild);
        });
      } else if (child.props.children) {
        validateChild(child.props.children);
      }
    }
  }

  const validateFormElements = (children: (ReactNode | ComponentElement<any, any>)[]) => {
    children.forEach((child: ReactNode | ComponentElement<any, any>) => {
      validateChild(child);
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    let validForm = true;
    e.preventDefault();
    validateFormElements(props.children);
    localErrors.forEach((errorMessages) => {
      if (errorMessages.length > 0) {
        validForm = false;
      }
    });
    if (validForm) {
      props.onSubmit(e);
    }
  };
  return <form {...props} onSubmit={handleSubmit} />;
}
