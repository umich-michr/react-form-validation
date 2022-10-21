"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var lib_1 = require("../../../../main/src/lib");
var react_1 = require("react");
var react_select_1 = require("react-select");
describe('Feature: Validated form component should be able to handle components that are not validated. (HOC is not used to create validated components', function () {
    describe('Scenario: Submit form without validated components (no data validation rules).', function () {
        var App = function () {
            var inputRef = (0, react_1.useRef)();
            var _a = (0, react_1.useState)(false), valid = _a[0], setValid = _a[1];
            var handleSubmit = function (e) {
                setValid(true);
                e.preventDefault();
                e.stopPropagation();
            };
            return ((0, jsx_runtime_1.jsxs)("section", __assign({ className: 'add-service' }, { children: [(0, jsx_runtime_1.jsxs)(lib_1.Form, __assign({ onSubmit: handleSubmit }, { children: [(0, jsx_runtime_1.jsx)("input", { type: 'text', name: 'firstName', placeholder: 'Enter a first name', ref: inputRef }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("button", __assign({ id: 'buttonSubmitForm' }, { children: "Submit form" }))] })), (0, jsx_runtime_1.jsx)("div", __assign({ id: 'formStatus' }, { children: valid ? 'Form is valid' : null }))] })));
        };
        it("Given form contains an  <input> element without any validation rule\n     And <Form> is submitted\n     Then validation <Error> message should not be displayed for <input>", function () {
            cy.mount((0, jsx_runtime_1.jsx)(App, {}));
            cy.get('#formStatus').should('be.empty');
            cy.get('#buttonSubmitForm').click();
            cy.get('#formStatus').should('have.text', 'Form is valid');
        });
    });
});
describe('Feature: Validated form component should be able to validate components requiring validations by specifying dataValidationRules attribute. (HOC is used to create validated components', function () {
    var errorClassName = 'field-error-text filled';
    var validEmail = 'johndoe@gmail.com', invalidEmail = 'john-doe', validSelectIndex = 1, invalidSelectIndex = 0, validReactSelectIndex = 1, invalidReactSelectIndex = 0, invalidEmailError = 'This value should be a valid email.', invalidSelectNumberError = 'Field is required', invalidReactSelectNumberError = 'Field is required', textareaTooLongError = 'This value is too long. It should have 2 characters or fewer.';
    var App = function () {
        var inputRef = (0, react_1.useRef)();
        var selectRef = (0, react_1.useRef)();
        var reactSelectRef = (0, react_1.useRef)();
        var textareaRef = (0, react_1.useRef)();
        var _a = (0, react_1.useState)(false), valid = _a[0], setValid = _a[1];
        var handleClick = function (e) {
            setValid(true);
            e.preventDefault();
            e.stopPropagation();
        };
        var ValidatedInput = (0, lib_1.withValidation)('input');
        var ValidatedSelect = (0, lib_1.withValidation)('select');
        var ValidatedTextArea = (0, lib_1.withValidation)('textarea');
        var ValidatedReactSelect = (0, lib_1.withValidation)(react_select_1.default);
        return ((0, jsx_runtime_1.jsxs)("section", __assign({ className: 'add-service' }, { children: [(0, jsx_runtime_1.jsxs)(lib_1.Form, __assign({ onSubmit: handleClick, errorClassName: errorClassName }, { children: [(0, jsx_runtime_1.jsx)(ValidatedInput, { name: 'email', type: 'text', placeholder: 'Enter an email', ref: inputRef, dataValidationRules: { email: { value: true } } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)(ValidatedSelect, __assign({ ref: selectRef, name: 'selectNumber', dataValidationRules: { required: { value: true } } }, { children: [(0, jsx_runtime_1.jsx)("option", __assign({ value: '' }, { children: "Choose a number..." })), (0, jsx_runtime_1.jsx)("option", __assign({ value: 'one' }, { children: "1" })), (0, jsx_runtime_1.jsx)("option", __assign({ value: 'Two' }, { children: "2" })), (0, jsx_runtime_1.jsx)("option", __assign({ value: 'Three' }, { children: "3" })), (0, jsx_runtime_1.jsx)("option", __assign({ value: 'Four' }, { children: "4" }))] })), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(ValidatedReactSelect, { id: 'reactSelectNumber', name: 'reactSelectNumber', ref: reactSelectRef, options: [
                                { label: 'Select one option...', value: undefined },
                                { label: 'One', value: '1' },
                                { label: 'Two', value: '2' }
                            ], dataValidationRules: { required: { value: true } } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)(ValidatedTextArea, { name: 'textarea', defaultValue: 'This text is more than 2 characters.', ref: textareaRef, rows: 4, cols: 40, dataValidationRules: { maxLength: { value: 2 } } }), (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("button", __assign({ id: 'buttonSubmitForm' }, { children: "Submit form" }))] })), (0, jsx_runtime_1.jsx)("div", { children: valid ? 'Form is valid' : null })] })));
    };
    describe('Scenario: Submit Form with validated components', function () {
        it.only("Given form contains an <input/> element with email validation rule\n      And <select/> element with a required validation rule\n      And react-select element with a required validation rule\n      And <textarea/> element with a maxLength validation rule\n      And error message class is passed as ".concat(errorClassName, "\n      When <Form> is submitted\n      Then <Error> messages should be displayed for <input/>: ").concat(invalidEmailError, ", <select/>: ").concat(invalidSelectNumberError, ", <textarea/>: ").concat(invalidReactSelectNumberError, " and <react-select/>: ").concat(textareaTooLongError, "\n       And Error messages should have ").concat(errorClassName, " as classname "), function () {
            cy.mount((0, jsx_runtime_1.jsx)(App, {}));
            cy.get('#reactSelectNumber').reactSelect(invalidReactSelectIndex);
            cy.get('#buttonSubmitForm').click();
            cy.get('#error-email').should('have.text', invalidEmailError);
            cy.get('#error-email').should('have.class', errorClassName);
            cy.get('#error-selectNumber').should('have.text', invalidSelectNumberError);
            cy.get('#error-reactSelectNumber').should('have.text', invalidReactSelectNumberError);
            cy.get('#error-textarea').should('have.text', textareaTooLongError);
        });
    });
    describe('Scenario: Form fields are invalid and fields change to valid state', function () {
        it("Given form contains <input/> email element\n               And error message ".concat(invalidEmailError, " is displayed\n               And required <select/> element\n               And error message ").concat(invalidSelectNumberError, " is displayed\n               And required <reactSelect/> element\n               And error message ").concat(invalidReactSelectNumberError, " is displayed\n              When ").concat(validEmail, " is typed in <input/>\n               And <select/> selected the option with index ").concat(validSelectIndex, "\n               And <reactSelect/> selected the option with index ").concat(validReactSelectIndex, "\n              Then no error message for any field should be displayed."), function () {
            cy.mount((0, jsx_runtime_1.jsx)(App, {}));
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
    describe('Scenario: Form fields are valid and fields change to invalid state', function () {
        it("Given form contains <input/> email element\n             And required <select/> element\n             And required <reactSelect/> element\n            When ".concat(invalidEmail, " is typed in <input/>\n             And <select/> selected the option with index ").concat(invalidSelectIndex, "\n             And <reactSelect/> selected the option with index ").concat(invalidReactSelectIndex, "\n            Then Error messages must be displayed for <input/> as ").concat(invalidEmailError, "\n             And for <select/> as ").concat(invalidSelectNumberError, "\n             And for <reactSelect/> as ").concat(invalidReactSelectNumberError, "."), function () {
            cy.mount((0, jsx_runtime_1.jsx)(App, {}));
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
