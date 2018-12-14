import axios from 'axios';

import authService from '../services/auth-service';
import axiosService from '../services/axios-service';
import {
    FETCH_RENTAL_BY_ID_SUCCESS,
    FETCH_RENTALS_SUCCESS,
    FETCH_RENTAL_BY_ID_INIT,
    FETCH_RENTALS_INIT,
    FETCH_RENTALS_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT
} from "./types";


const axiosInstance= axiosService.getInstance();

// RENTALS ACTIONS -------------------------

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

const fetchRentalsInit = () => {
    return {
        type: FETCH_RENTALS_INIT
    };
};

const fetchRentalsFail = (errors) => {
    return {
        type: FETCH_RENTALS_FAIL,
        errors: errors
    };
};

export const fetchRentals = (city) => {
    const url = city ? `/rentals?city=${city}` : '/rentals';
    return (dispatch) => {
        dispatch(fetchRentalByIdInit());
        axiosInstance.get(url)
            .then((res) => res.data)
            .then((rentals) => dispatch(fetchRentalsSuccess(rentals)))
            .catch(({response}) => dispatch(fetchRentalsFail(response.data.errors)));
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

// AUTH ACTIONS -------------------------

export const register = (userData) => {
    return axios.post('/api/v1/users/register', userData).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return Promise.reject(error.response.data.errors);
        });
};

const loginSuccess = () => {
    return {
        type: LOGIN_SUCCESS
    }
};

const loginFailure = (errors) => {
    return {
        type: LOGIN_FAILURE,
        errors: errors
    }
};

export const checkAuthState = () => {
    return dispatch => {
        if (authService.isAuthenticated()) {
            dispatch(loginSuccess());
        }
    }
};

export const login = (userData) => {
    return dispatch => {
        return axios.post('/api/v1/users/auth', userData).then((res) => {
            return res.data;
        }).then(token => {
            localStorage.setItem('auth_token', token);
            dispatch(loginSuccess());
        }).catch((error) => {
            dispatch(loginFailure(error.response.data.errors));
        })
    }
};

export const logout = () => {
    authService.invalidateUser();
    return {
        type: LOGOUT
    };
};

export const createBooking = (booking) => {
    return axiosInstance.post('/bookings', booking)
        .then(res => res.data)
        .catch(({response}) => Promise.reject(response.data.errors));
};
