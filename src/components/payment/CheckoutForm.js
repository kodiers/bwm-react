import React from 'react';
import {injectStripe, CardElement} from 'react-stripe-elements';

import {formStyles, createOptions, paragraphStyles, buttonStyles} from "./styles";


class CheckoutForm extends React.Component {
    handleSubmit = (e) => {
        const {stripe} = this.props;
        e.preventDefault();
    };

    render() {
        return (
            <form {...formStyles()} onSubmit={this.handleSubmit}>
                <CardElement {...createOptions()}/>
                <p {...paragraphStyles()}>You will be not charged yet.</p>
                <button {...buttonStyles()} className='btn btn-success'>Confirm payment</button>
            </form>
        )
    }
}

export default injectStripe(CheckoutForm);
