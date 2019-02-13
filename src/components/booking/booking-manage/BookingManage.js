import React from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";

import * as actions from '../../../actions';
import {BookingCard, PaymentCard} from "./BookingCard";
import {ReviewModal} from "../../review/ReviewModal";
import {isExpired} from "../../../helpers";


export class BookingManage extends React.Component {
    state = {pendingPayments: []};

    componentDidMount() {
        this.props.dispatch(actions.fetchUserBookings());
        this.getPendingPayments();
    }

    getPendingPayments() {
        actions.getPendingPayments()
            .then(pendingPayments => this.setState({pendingPayments}))
            .catch((err) => {});
    }

    acceptPayment(payment) {
        actions.acceptPayment(payment)
            .then(status => {
                this.getPendingPayments();
            })
            .catch((err) => {});
    }

    declinePayment(payment) {
        actions.declinePayment(payment)
            .then(status => {
                this.getPendingPayments();
            })
            .catch((err) => {});
    }

    handleReviewCreated = (review, bookingIndex) => {
        const {dispatch} = this.props;
        const {data: bookings} = this.props.userBookings;
        bookings[bookingIndex].review = review;
        dispatch(actions.updateBookings(bookings));
    };

    renderBookings(bookings) {
        return bookings.map((booking, index) => <BookingCard booking={booking}
                                                             hasReview={!!booking.review}
                                                             isExpired={isExpired(booking.endAt)}
                                                             reviewModal={() => <ReviewModal onReviewCreated={(review) => {
                                                                 this.handleReviewCreated(review, index)
                                                             }} bookingId={booking._id}/>}
                                                             key={index}/>);
    }

    renderPayments(payments) {
        return payments.map((payment, index) => <PaymentCard
                                                    booking={payment.booking}
                                                    payment={payment}
                                                    paymentBtns={this.renderPaymentButtons}
                                                    key={index}/>);
    }

    renderPaymentButtons = (payment) => {
        return (
            <div>
                <button className='btn btn-success' onClick={() => this.acceptPayment(payment)}>Accept</button>{' '}
                <button className='btn btn-danger' onClick={() => this.declinePayment(payment)}>Decline</button>
            </div>
        )
    }

    render() {
        const {data: bookings, isFetching} = this.props.userBookings;
        const {pendingPayments} = this.state;
        return (
            <React.Fragment>
                <section id='userBookings'>
                    <h1 className='page-title'>My Bookings</h1>
                    <div className='row'>
                        {this.renderBookings(bookings)}
                    </div>
                    { !isFetching && bookings.length === 0 &&
                        <div className='alert alert-warning'>
                            You have no bookings created go to rentals section and book your place today.
                            <Link style={{marginLeft: '10px'}} className='btn btn-bwm' to='/rentals'>Available Rental</Link>
                        </div>
                    }
                </section>
                <section id='pendingBookings'>
                    <h1 className='page-title'>Pending Bookings</h1>
                    <div className='row'>
                        {this.renderPayments(pendingPayments)}
                    </div>
                    { !isFetching && pendingPayments.length === 0 &&
                    <div className='alert alert-warning'>
                        You have no pending bookings.
                    </div>
                    }
                </section>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        userBookings: state.userBookings
    };
}

export default connect(mapStateToProps)(BookingManage)
