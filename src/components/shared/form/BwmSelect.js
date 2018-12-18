import React from "react";

export const BwmSelect = ({input, label, options, meta: { touched, error, warning }, className}) => {

    function renderOptions(options) {
        return options.map((option, index) => {
            return <option value={option} key={index}>{option}</option>
        });
    }
    return (
        <div className='form-group'>
            <label>{label}</label>
            <div className='input-group'>
                <select {...input} className={className} >
                    {renderOptions(options)}
                </select>
            </div>
            {touched && ((error && <div className='alert alert-danger'>{error}</div>))}
        </div>
    );
};
