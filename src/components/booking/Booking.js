import React from 'react';

import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as moment from 'moment';

import {getRangeOfDates} from "../../helpers";
import {BookingModal} from "./BookingModal";


export class Booking extends React.Component {

    constructor() {
        super();
        this.bookedOutDates = [];
        this.state = {
            proposedBooking: {
                startAt: '',
                endAt: '',
                guests: 0,
                rental: {}
            },
            modal: {
                open: false
            }
        };
        this.dateRef = React.createRef();
        this.checkInvalidDates = this.checkInvalidDates.bind(this);
        this.handleApply = this.handleApply.bind(this);
        this.cancelConfirmation = this.cancelConfirmation.bind(this);
    }

    componentWillMount() {
        this.getBookedOutDates();
    }

    getBookedOutDates() {
        const {bookings} = this.props.rental;
        if (bookings && bookings.length > 0) {
            bookings.forEach(booking => {
                const dateRange = getRangeOfDates(booking.startAt, booking.endAt, 'Y/MM/DD');
                this.bookedOutDates.push(...dateRange);
            });
        }
    }

    checkInvalidDates(date) {
        return this.bookedOutDates.includes(date.format('Y/MM/DD')) || date.diff(moment(), 'days') < -1;
    }

    handleApply(event, picker) {
        const startAt = picker.startDate.format('Y/MM/DD');
        const endAt = picker.endDate.format('Y/MM/DD');
        this.dateRef.current.value = startAt + ' to ' + endAt;
        this.setState({
            proposedBooking: {
                ...this.state.proposedBooking,
                startAt,
                endAt
            }
        });
    }

    selectGuests(event) {
        this.setState({
            proposedBooking: {
                ...this.state.proposedBooking,
                guests: parseInt(event.target.value)
            }
        });
    }

    confirmProposedData() {
        const {startAt, endAt} = this.state.proposedBooking;
        const days = getRangeOfDates(startAt, endAt).length - 1;
        const {rental} = this.props;

        this.setState({
            proposedBooking: {
                ...this.state.proposedBooking,
                days,
                totalPrice: days * rental.dailyRate,
                rental
            },
            modal: {open: true}
        });
    }

    cancelConfirmation() {
        this.setState({modal: {open: false}});
    }

    render() {

        const {rental} = this.props;
        const {startAt, endAt, guests} = this.state.proposedBooking;

        return (
            <div className='booking'>
                <h3 className='booking-price'>$ {rental.dailyRate} <span className='booking-per-night'>per night</span></h3>
                <hr></hr>
                <div className='form-group'>
                    <label htmlFor='dates'>Dates</label>
                    <DateRangePicker
                        opens='left'
                        containerStyles={{display: 'block'}}
                        isInvalidDate={this.checkInvalidDates}
                        onApply={this.handleApply}>
                        <input id='dates' type='text' className='form-control' ref={this.dateRef}/>
                    </DateRangePicker>
                </div>
                <div className='form-group'>
                    <label htmlFor='guests'>Guests</label>
                    <input
                        type='number'
                        className='form-control'
                        id='guests'
                        aria-describedby='guests'
                        placeholder=''
                        onChange={(event) => {this.selectGuests(event)}} />
                </div>
                <button
                    className='btn btn-bwm btn-confirm btn-block'
                    onClick={() => this.confirmProposedData()}
                    disabled={!startAt || !endAt || !guests}>Reserve place now</button>
                <hr></hr>
                <p className='booking-note-title'>People are interested into this house</p>
                <p className='booking-note-text'>
                    More than 500 people checked this rental in last month.
                </p>
                <BookingModal
                    closeModal={this.cancelConfirmation}
                    open={this.state.modal.open}
                    booking={this.state.proposedBooking}/>
            </div>
        )
    }
}
