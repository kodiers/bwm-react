import axios from 'axios';

import {FETCH_RENTAL_BY_ID_SUCCESS, FETCH_RENTALS_SUCCESS, FETCH_RENTAL_BY_ID_INIT} from "./types";

const fetchRentalByIdSuccess = (rental) => {
    return {
        type: FETCH_RENTAL_BY_ID_SUCCESS,
        rental: rental
    }
};

const fetchRentalByIdInit = () => {
    return {
        type: FETCH_RENTAL_BY_ID_INIT
    };
};

const fetchRentalsSuccess = (rentals) => {
    return {
        type: FETCH_RENTALS_SUCCESS,
        rentals: rentals
    };
};

export const fetchRentals = () => {
    return (dispatch) => {
        axios.get('/api/v1/rentals').then((res) => {
            return res.data;
        }).then((rentals) => {
            dispatch(fetchRentalsSuccess(rentals));
        });
    };
};

export const fetchRentalById = (rentalId) => {
    return function(dispatch) {
        dispatch(fetchRentalByIdInit());
        axios.get(`/api/v1/rentals/${rentalId}`).then((res) => {
            return res.data;
        }).then((rental) => {
            dispatch(fetchRentalByIdSuccess(rental));
        });
    };
};
