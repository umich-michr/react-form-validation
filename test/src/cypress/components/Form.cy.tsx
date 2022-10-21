import {Form, withValidation} from '../../../../main/src/lib';
import {FormEvent, LegacyRef, useRef, useState} from 'react';
import {default as reactSelect} from 'react-select';
import {Simulate} from 'react-dom/test-utils';

describe('Feature: Validated form component should be able to handle components that are not validated. (HOC is not used to create validated components', () => {
  describe('Scenario: Submit form without validated components (no data validation rules).', () => {
    const App = () => {
      const inputRef = useRef() as LegacyRef<HTMLInputElement>;

      const [valid, setValid] = useState(false);
      const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        setValid(true);
        e.preventDefault();
        e.stopPropagation();
      };

      return (
        <section className='add-service'>
          <Form onSubmit={handleSubmit}>
            <input type='text' name='firstName' placeholder='Enter a first name' ref={inputRef} />
            <br />
            <button id='buttonSubmitForm'>Submit form</button>
          </Form>
          <div id='formStatus'>{valid ? 'Form is valid' : null}</div>
        </section>
      );
    };

    it(`Given form contains an  <input> element without any validation rule
     And <Form> is submitted
     Then validation <Error> message should not be displayed for <input>`, () => {
      cy.mount(<App />);
      cy.get('#formStatus').should('be.empty');

      cy.get('#buttonSubmitForm').click();

      cy.get('#formStatus').should('have.text', 'Form is valid');
    });
  });
});

describe('Feature: Validated form component should be able to validate components requiring validations by specifying dataValidationRules attribute. (HOC is used to create validated components', () => {
  const errorClassName = 'field-error-text filled';
  const validEmail = 'johndoe@gmail.com',
    invalidEmail = 'john-doe',
    validSelectIndex = 1,
    invalidSelectIndex = 0,
    validReactSelectIndex = 1,
    invalidReactSelectIndex = 0,
    invalidEmailError = 'This value should be a valid email.',
    invalidSelectNumberError = 'Field is required',
    invalidReactSelectNumberError = 'Field is required',
    textareaTooLongError = 'This value is too long. It should have 2 characters or fewer.';
  const App = () => {
    const inputRef = useRef();
    const selectRef = useRef();
    const reactSelectRef = useRef();
    const textareaRef = useRef();

    const [valid, setValid] = useState(false);
    const handleClick = (e) => {
      setValid(true);
      e.preventDefault();
      e.stopPropagation();
    };

    const ValidatedInput = withValidation('input');
    const ValidatedSelect = withValidation('select');
    const ValidatedTextArea = withValidation('textarea');
    const ValidatedReactSelect = withValidation(reactSelect);

    return (
      <section className='add-service'>
        <Form onSubmit={handleClick} errorClassName={errorClassName}>
          <ValidatedInput
            name='email'
            type='text'
            placeholder='Enter an email'
            ref={inputRef}
            dataValidationRules={{email: {value: true}}}
          />
          <br />
          <ValidatedSelect ref={selectRef} name={'selectNumber'} dataValidationRules={{required: {value: true}}}>
            <option value=''>Choose a number...</option>
            <option value='one'>1</option>
            <option value='Two'>2</option>
            <option value='Three'>3</option>
            <option value='Four'>4</option>
          </ValidatedSelect>
          <br />
          <ValidatedReactSelect
            id={'reactSelectNumber'}
            name={'reactSelectNumber'}
            ref={reactSelectRef}
            options={[
              {label: 'Select one option...', value: undefined},
              {label: 'One', value: '1'},
              {label: 'Two', value: '2'}
            ]}
            dataValidationRules={{required: {value: true}}}
          />
          <br />
          <ValidatedTextArea
            name='textarea'
            defaultValue='This text is more than 2 characters.'
            ref={textareaRef}
            rows={4}
            cols={40}
            dataValidationRules={{maxLength: {value: 2}}}
          />
          <br />
          <button id='buttonSubmitForm'>Submit form</button>
        </Form>
        <div>{valid ? 'Form is valid' : null}</div>
      </section>
    );
  };

  describe('Scenario: Submit Form with validated components', () => {
    it(`Given form contains an <input/> element with email validation rule
      And <select/> element with a required validation rule
      And react-select element with a required validation rule
      And <textarea/> element with a maxLength validation rule
      And error message class is passed as ${errorClassName}
      When <Form> is submitted
      Then <Error> messages should be displayed for <input/>: ${invalidEmailError}, <select/>: ${invalidSelectNumberError}, <textarea/>: ${invalidReactSelectNumberError} and <react-select/>: ${textareaTooLongError}
       And Error messages should have ${errorClassName} as classname `, () => {
      cy.mount(<App />);

      cy.get('#reactSelectNumber').reactSelect(invalidReactSelectIndex);
      cy.get('#buttonSubmitForm').click();

      cy.get('#error-email').should('have.text', invalidEmailError);
      cy.get('#error-email').should('have.class', errorClassName);
      cy.get('#error-selectNumber').should('have.text', invalidSelectNumberError);
      cy.get('#error-reactSelectNumber').should('have.text', invalidReactSelectNumberError);
      cy.get('#error-textarea').should('have.text', textareaTooLongError);
    });
  });

  describe('Scenario: Form fields are invalid and fields change to valid state', () => {
    it(`Given form contains <input/> email element
               And error message ${invalidEmailError} is displayed
               And required <select/> element
               And error message ${invalidSelectNumberError} is displayed
               And required <reactSelect/> element
               And error message ${invalidReactSelectNumberError} is displayed
              When ${validEmail} is typed in <input/>
               And <select/> selected the option with index ${validSelectIndex}
               And <reactSelect/> selected the option with index ${validReactSelectIndex}
              Then no error message for any field should be displayed.`, () => {
      cy.mount(<App />);

      cy.get('[name=email]').clear().type(invalidEmail);

      cy.get('#buttonSubmitForm').click();

      cy.get('#error-email').should('have.text', invalidEmailError);
      cy.get('[name=email]').clear().type(validEmail);
      cy.get('#error-email').should('not.exist');

      cy.get('#error-selectNumber').should('have.text', invalidSelectNumberError);
      cy.get('[name=selectNumber]').select(validSelectIndex);
      cy.get('#error-selectNumber').should('not.exist');

      cy.get('#error-reactSelectNumber').should('have.text', invalidReactSelectNumberError);
      cy.get('#reactSelectNumber').reactSelect(validReactSelectIndex);
      cy.get('#error-reactSelectNumber').should('not.exist');
    });
  });

  describe('Scenario: Form fields are valid and fields change to invalid state', () => {
    it(`Given form contains <input/> email element
             And required <select/> element
             And required <reactSelect/> element
            When ${invalidEmail} is typed in <input/>
             And <select/> selected the option with index ${invalidSelectIndex}
             And <reactSelect/> selected the option with index ${invalidReactSelectIndex}
            Then Error messages must be displayed for <input/> as ${invalidEmailError}
             And for <select/> as ${invalidSelectNumberError}
             And for <reactSelect/> as ${invalidReactSelectNumberError}.`, () => {
      cy.mount(<App />);

      cy.get('[name=email]').clear().type(validEmail);
      cy.get('#error-email').should('not.exist');

      cy.get('[name=email]').clear().type(invalidEmail);
      cy.get('#error-email').should('have.text', invalidEmailError);

      cy.get('[name=selectNumber]').select(validSelectIndex);
      cy.get('#error-selectNumber').should('not.exist');

      cy.get('[name=selectNumber]').select(invalidSelectIndex);
      cy.get('#error-selectNumber').should('have.text', invalidSelectNumberError);

      cy.get('#reactSelectNumber').reactSelect(validReactSelectIndex);
      cy.get('#error-reactSelectNumber').should('not.exist');
      cy.get('#reactSelectNumber').reactSelect(invalidReactSelectIndex);
      cy.get('#error-reactSelectNumber').should('have.text', invalidReactSelectNumberError);
    });
  });
});
