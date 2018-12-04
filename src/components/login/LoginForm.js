import React from 'react';
import {Field, reduxForm} from "redux-form";

import {BwmInput} from "../shared/form/BwmInput";
import {BwmResError} from "../shared/form/BwmResError";
import {required, minLenght4} from "../shared/form/validators";

const LoginForm = props => {
    const { handleSubmit, pristine, submitting, submitCb, valid } = props;

    return (
        <form onSubmit={handleSubmit(submitCb)}>
            <Field
                name="email"
                component={BwmInput}
                type="email"
                label='email'
                validate={[required, minLenght4]}
                className='form-control'/>
            <Field
                name="password"
                component={BwmInput}
                type="password"
                label='password'
                validate={[required]}
                className='form-control'/>
            <button type="submit" className='btn btn-bwm btn-form' disabled={!valid || pristine || submitting}>
                Submit
            </button>
        </form>
    )
};

export default reduxForm({
    form: 'loginForm'
})(LoginForm)
