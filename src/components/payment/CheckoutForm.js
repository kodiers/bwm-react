import React from 'react';
import {injectStripe, CardElement} from 'react-stripe-elements';

import {formStyles, createOptions, paragraphStyles, buttonStyles} from "./styles";


class CheckoutForm extends React.Component {
    state = {
        error: undefined
    };

    handleSubmit = (e) => {
        const {stripe, setPaymentToken} = this.props;
        e.preventDefault();
        if (stripe) {
            stripe.createToken().then((payload) => {
                if (payload.error) {
                    setPaymentToken(undefined);
                    return this.setState({error: payload.error.message});
                }
                setPaymentToken(payload.token.id);
            });
        } else {
            console.error("Stripe.js has not loaded yet.")
        }
    };

    render() {
        const {error} = this.state;
        return (
            <form {...formStyles()} onSubmit={this.handleSubmit}>
                <CardElement {...createOptions()}/>
                <p {...paragraphStyles()}>You will be not charged yet.</p>
                {
                    error &&
                        <div className='alert alert-danger alert-payment'>{error}</div>
                }
                <button {...buttonStyles()} className='btn btn-success'>Confirm payment</button>
            </form>
        )
    }
}

export default injectStripe(CheckoutForm);
