/* eslint-disable no-console */
import {Form, withValidation} from '../index';
import {FormEvent, useRef} from 'react';

function handleSubmit(e: FormEvent<HTMLFormElement>) {
  console.log('submit clicked');
  e.stopPropagation();
}

export default function TestForm() {
  const firstNameRef = useRef({
    element: useRef(),
    validate: () => {
      console.log('hi');
    }
  });
  const ValidatedInput = withValidation('input');
  return (
    <div>
      <Form id={'1'} errorClassName={'errorClass'} onSubmit={handleSubmit}>
        <label>This component is to test form validation</label>
        <ValidatedInput
          id='inputTextExternalClientFirstName'
          name='firstName'
          type='text'
          placeholder='First Name'
          dataValidationRules={{required: {value: true}, maxLength: {value: 2}}}
          ref={firstNameRef}
        />
        <button type='submit' value='Submit'>
          Submit
        </button>
      </Form>
    </div>
  );
}
