import React from 'react';
import {Field, reduxForm} from "redux-form";

import {BwmInput} from "../../shared/form/BwmInput";
import {BwmResError} from "../../shared/form/BwmResError";
import {BwmTextArea} from "../../shared/form/BwmTextArea";
import {BwmSelect} from "../../shared/form/BwmSelect";
import {BwmFileUpload} from "../../shared/form/BwmFileUpload";
// import {required, minLenght4} from "../../shared/form/validators";

const RentalCreateForm = props => {
    const { handleSubmit, pristine, submitting, submitCb, valid, errors, options } = props;

    return (
        <form onSubmit={handleSubmit(submitCb)}>
            <Field
                name="title"
                component={BwmInput}
                type="text"
                label='Title'
                className='form-control'/>
            <Field
                name="description"
                component={BwmTextArea}
                type="text"
                rows='6'
                label='Description'
                className='form-control'/>
            <Field
                name="city"
                component={BwmInput}
                type="text"
                label='City'
                className='form-control'/>
            <Field
                name="street"
                component={BwmInput}
                type="text"
                label='Street'
                className='form-control'/>
            <Field
                name="category"
                component={BwmSelect}
                label='Category'
                options={options}
                className='form-control'/>
            <Field
                name="image"
                component={BwmFileUpload}
                label='Image'/>
            <Field
                name="bedrooms"
                component={BwmInput}
                type="number"
                label='Bedrooms'
                className='form-control'/>
            <Field
                name="dailyRate"
                component={BwmInput}
                type="number"
                label='Daily Rate'
                symbol='$'
                className='form-control'/>
            <Field
                name="shared"
                component={BwmInput}
                type="checkbox"
                label='Shared'
                className='form-control'/>
            <button type="submit" className='btn btn-bwm btn-form' disabled={!valid || pristine || submitting}>
                Create Rental
            </button>
            <BwmResError errors={errors}/>
        </form>
    )
};

export default reduxForm({
    form: 'rentalCreateForm',
    initialValues: {shared: false, category: 'apartment'}
})(RentalCreateForm)
