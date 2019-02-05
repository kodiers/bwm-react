const config = require('../config');

const moment = require('moment');
const stripe = require('stripe')(config.STRIPE_SK);

const Booking = require('../models/booking');
const Rental = require('../models/rental');
const User = require('../models/user');
const Payment = require('../models/payment');
const {normalizeErrors} = require('../helpers/mongoose');

const CUSTOMER_SHARE = 0.8;


exports.createBooking = function (req, res) {
  const {startAt, endAt, totalPrice, days, guests, rental, paymentToken} = req.body;
  const user = res.locals.user;
  const booking = new Booking({startAt, endAt, totalPrice, days, guests});
  Rental.findById(rental._id).populate('bookings').populate('user').exec(async function (err, foundRental) {
    if (err) {
      return res.status(500).send({errors: normalizeErrors(err.errors)});
    }
    if (foundRental.user.id === user.id) {
      return res.status(400).send({errors: [{title: 'Invalid user!', detail: 'Cannot create booking on your rental'}]});
    }
    if (isValidBooking(booking, foundRental)) {
      booking.user = user;
      booking.rental = foundRental;
      const {payment, err} = await createPayment(booking, foundRental.user, paymentToken);
      if (payment) {
        booking.payment = payment;
        foundRental.bookings.push(booking);
        booking.save(function (err) {
          if (err) {
            return res.status(500).send({errors: normalizeErrors(err.errors)});
          }
          foundRental.save();
          User.updateOne(
            {_id: user.id},
            {$push: {bookings: booking}},
            function () {});
          return res.json({'startAt': booking.startAt, 'endAt': booking.endAt});
        });
      } else {
        return res.status(500).send({errors: [{title: 'Invalid payment!', detail: err}]});
      }
    } else {
      return res.status(400).send({errors: [{title: 'Invalid booking!', detail: 'Choosen dates are already taken'}]});
    }
  });
};

exports.getUserBookings = function (req, res) {
  const user = res.locals.user;
  Booking.where({user: user}).populate('rental').exec(function (err, foundBookings) {
    if (err) {
      return res.status(500).send({errors: normalizeErrors(err.errors)});
    }
    return res.json(foundBookings);
  });
};

function isValidBooking(proposedBooking, rental) {
  let isValid = true;
  if (rental.bookings && rental.bookings.length > 0) {
    isValid = rental.bookings.every(function (booking) {
      const proposedStart = moment(proposedBooking.startAt);
      const proposedEnd = moment(proposedBooking.endAt);
      const actualStart = moment(booking.startAt);
      const actualEnd = moment(booking.endAt);
      return ((actualStart < proposedStart && actualEnd < proposedStart) || (proposedEnd < actualEnd && proposedEnd < actualStart));
    })
  }
  return isValid;
}

async function createPayment(booking, toUser, token) {
  const {user} = booking;
  const customer = await stripe.customers.create({
    source: token.id,
    email: user.email
  });

  if (customer) {
    User.updateOne({_id: user.id}, {$set: {stripeCustomerId: customer.id}}, () => {});
    const payment = new Payment({
      fromUser: user,
      toUser: toUser,
      fromStripeCustomerId: customer.id,
      booking: booking,
      tokenId: token.id,
      amount: booking.totalPrice * 100 * CUSTOMER_SHARE,
    });
    try {
      const savedPayment = await payment.save();
      return {payment: savedPayment};
    } catch(err) {
      return {err: err.message};
    }
  } else {
    return {err: 'Cannot process payment!'};
  }
}
