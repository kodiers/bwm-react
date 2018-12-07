import React from "react";

export const BwmInput = ({input, label, type, meta: { touched, error, warning }, className}) => (
    <div className='form-group'>
        <label>{label}</label>
        <div className='input-group'>
            <input {...input} type={type} className={className} />
        </div>
        {touched && ((error && <div className='alert alert-danger'>{error}</div>))}
    </div>
);
