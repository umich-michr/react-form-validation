import {Form, withValidation} from '../lib';
import {FormEvent, useRef} from 'react';
import {default as ReactSelect} from 'react-select';

function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.stopPropagation();
}

export default function TestForm() {
  const ValidatedInput = withValidation('input');
  const ValidatedReactSelect = withValidation(ReactSelect);
  const ValidatedSelect = withValidation('select');
  const DEFAULT_REF_OBJ = {
    element: useRef(),
    validate: () => {
      return;
    }
  };

  const firstNameRef = useRef(DEFAULT_REF_OBJ);
  const reactSelectRef = useRef(DEFAULT_REF_OBJ);
  const reactMultiSelectRef = useRef(DEFAULT_REF_OBJ);
  const htmlSelectRef = useRef(DEFAULT_REF_OBJ);
  const htmlMultiSelectRef = useRef(DEFAULT_REF_OBJ);

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
        <hr></hr>
        <label htmlFor='inputSelectCountry'>Select at most two countries:</label>
        <ValidatedReactSelect
          isMulti
          inputId={'inputSelectCountry'}
          name={'selectCountry'}
          ref={reactMultiSelectRef}
          dataValidationRules={{required: {value: true}, maxLength: {value: 2}}}
          // @ts-ignore
          isOptionDisabled={(option) => option.disabled}
          options={[
            {label: 'Select at most two countries', id: undefined, disabled: true},
            {label: 'US', id: '1'},
            {label: 'Madagascar', id: '2'},
            {label: 'Liechtenstein', id: '3'}
          ]}
          // @ts-ignore
          getOptionLabel={(option) => option.label}
          // @ts-ignore
          getOptionValue={(option) => option.id}
        />
        <hr></hr>
        <label id='labelReactSelectNumber' htmlFor='inputSelectNumber'>
          Select at least one number:
        </label>
        <ValidatedReactSelect
          inputId={'inputSelectNumber'}
          name={'selectNumber'}
          ref={reactSelectRef}
          valueSelector={(val) => val[0]?.id}
          dataValidationRules={{required: {value: true}}}
          options={[
            {label: 'Select one option...', id: ''},
            {label: 'One', id: '1'},
            {label: 'Two', id: '2'}
          ]}
          // @ts-ignore
          getOptionLabel={(option) => option.label}
          // @ts-ignore
          getOptionValue={(option) => option.id}
          onChange={(e) => {
            // @ts-ignore
            console.debug('Hi: ', this);
          }}
        />
        <hr></hr>
        <label htmlFor='selectCars'>Choose 2 cars:</label>
        <br />
        <ValidatedSelect
          dataValidationRules={{
            required: {
              value: true,
              errorMessage: 'You should select a valid value, selections can not include emtpy selections.'
            },
            maxLength: {value: 2}
          }}
          ref={htmlMultiSelectRef}
          name='cars'
          id='selectCars'
          valueSelector={(val: string[]) => (val.includes('') ? undefined : val)}
          multiple>
          <option></option>
          <option value='volvo'>Volvo</option>
          <option value='saab'>Saab</option>
          <option value='opel'>Opel</option>
          <option value='audi'>Audi</option>
        </ValidatedSelect>
        <hr></hr>
        <label htmlFor='selectNumbers'>Choose 1 Number:</label>
        <br />
        <ValidatedSelect
          dataValidationRules={{required: {value: true}}}
          ref={htmlSelectRef}
          name='numbers'
          id='selectNumbers'>
          <option></option>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
        </ValidatedSelect>

        <button type='submit' value='Submit'>
          Submit
        </button>
      </Form>
    </div>
  );
}
