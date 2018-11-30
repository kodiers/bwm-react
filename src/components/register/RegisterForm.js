import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {BwmInput} from "../shared/form/BwmInput";
import {BwmResError} from "../shared/form/BwmResError";


const RegisterForm = props => {
    const { handleSubmit, pristine, submitting, submitCb, valid, errors } = props;

    return (
        <form onSubmit={handleSubmit(submitCb)}>
            <Field
                name="username"
                type="text"
                className='form-control'
                label='Username'
                component={BwmInput}
            />
            <Field
                name="email"
                component={BwmInput}
                type="email"
                label='email'
                className='form-control'/>
            <Field
                name="password"
                component={BwmInput}
                type="password"
                label='password'
                className='form-control'/>
            <Field
                name="passwordConfirmation"
                component={BwmInput}
                type="password"
                label='Password confirmation'
                className='form-control'/>
            <button type="submit" className='btn btn-bwm btn-form' disabled={!valid || pristine || submitting}>
                Submit
            </button>
            <BwmResError errors={errors}/>
        </form>
    )
};

const validate = values => {
    const errors = {};
    if (values.username && values.username.length < 4) {
        errors.username = 'Username min length is 4 characters';
    }
    if (!values.email) {
        errors.email = 'Enter email!';
    }
    if (!values.passwordConfirmation) {
        errors.passwordConfirmation = 'Enter password confirmation!';
    }
    if (values.password !== values.passwordConfirmation) {
        errors.password = 'Passwords must be the same';
    }
    return errors
};

export default reduxForm({
    form: 'registerForm', // a unique identifier for this form,
    validate: validate
})(RegisterForm)
