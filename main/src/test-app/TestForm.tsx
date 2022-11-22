import {Form, withValidation} from '../lib';
import {FormEvent, useRef} from 'react';
import {default as ReactSelect} from 'react-select';

function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.stopPropagation();
}

export default function TestForm() {
  const firstNameRef = useRef({
    element: useRef(),
    validate: () => {
      return;
    }
  });
  const ValidatedInput = withValidation('input');
  const ValidatedReactSelect = withValidation(ReactSelect);
  const reactSelectRef = useRef({
    element: useRef(),
    validate: () => {
      return;
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
          valueSelector={(val) => {
            if (Array.isArray(val)) {
              // @ts-ignore
              return val[0]?.id;
            } else if (typeof val === 'number') {
              // @ts-ignore
              return val;
            } else if (typeof val === 'string') {
              // @ts-ignore
              return val;
            } else if (typeof val === 'object') {
              return val?.id;
            }
          }}
          dataValidationRules={{required: {value: true}}}
          options={[
            {label: 'Select one option...', id: undefined},
            {label: 'One', id: '1'},
            {label: 'Two', id: '2'}
          ]}
          // @ts-ignore
          getOptionLabel={(option) => option.label}
          // @ts-ignore
          getOptionValue={(option) => option.id}
        />
        <button type='submit' value='Submit'>
          Submit
        </button>
      </Form>
    </div>
  );
}
