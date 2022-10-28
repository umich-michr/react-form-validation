/* eslint-disable no-console */
import {Form, withValidation} from '../index';
import {FormEvent, useRef} from 'react';
import {default as ReactSelect} from 'react-select';

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
  const ValidatedReactSelect = withValidation(ReactSelect);
  const reactSelectRef = useRef({
    element: useRef(),
    validate: () => {
      console.log('hi');
    }
  });

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
        <br />
        <ValidatedReactSelect
          id={'reactSelectNumber'}
          name={'reactSelectNumber'}
          ref={reactSelectRef}
          valueSelector={(val) => val.id}
          options={[
            {label: 'Select one option...', id: undefined},
            {label: 'One', id: '1'},
            {label: 'Two', id: '2'}
          ]}
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          getOptionLabel={(option) => option.label}
          // @ts-ignore
          getOptionValue={(option) => option.id}
          dataValidationRules={{required: {value: true}}}
        />
        <button type='submit' value='Submit'>
          Submit
        </button>
      </Form>
    </div>
  );
}
