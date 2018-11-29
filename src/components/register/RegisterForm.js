import React from 'react';
import { Field, reduxForm } from 'redux-form';

const renderField = ({input, label, type, meta: { touched, error, warning }, className}) => (
    <div className='form-group'>
        <label>{label}</label>
        <div className='input-group'>
            <input {...input} type={type} className={className} />
        </div>
        {touched && ((error && <div className='alert alert-danger'>{error}</div>))}
    </div>
);

const RegisterForm = props => {
    const { handleSubmit, pristine, reset, submitting, submitCb } = props;

    return (
        <form onSubmit={handleSubmit(submitCb)}>
            <Field
                name="username"
                type="text"
                className='form-control'
                label='Username'
                component={renderField}
            />
            <Field
                name="email"
                component={renderField}
                type="email"
                label='email'
                className='form-control'/>
            <Field
                name="password"
                component={renderField}
                type="password"
                label='password'
                className='form-control'/>
            <Field
                name="passwordConfirmation"
                component={renderField}
                type="password"
                label='Password confirmation'
                className='form-control'/>
            <button type="submit" className='btn btn-bwm btn-form' disabled={pristine || submitting}>
                Submit
            </button>
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
