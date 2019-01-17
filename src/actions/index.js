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
    LOGOUT,
    FETCH_USER_BOOKINGS_SUCCESS,
    FETCH_USER_BOOKINGS_INIT,
    FETCH_USER_BOOKINGS_FAIL,
    UPDATE_RENTAL_SUCCESS,
    UPDATE_RENTAL_FAIL,
    RESET_RENTAL_ERRORS
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

export const createRental = (rentalData) => {
    return axiosInstance.post('/rentals', rentalData).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return Promise.reject(error.response.data.errors);
        });
};

export const resetRentalErrors = () => {
    return {
        type: RESET_RENTAL_ERRORS
    }
};

const updateRentalSuccess = (updatedRental) => {
    return {
        type: UPDATE_RENTAL_SUCCESS,
        rental: updatedRental
    }
};

const updateRentalFail = (errors) => {
    return {
        type: UPDATE_RENTAL_FAIL,
        errors: errors
    }
};

export const updateRental = (id, rentalData) => dispatch => {
    return axiosInstance.patch(`/rentals/${id}`, rentalData)
        .then(res => res.data)
        .then(updatedRental => {
            dispatch(updateRentalSuccess(updatedRental));
        })
        .catch(({response}) => dispatch(updateRentalFail(response.data.errors)));
};

// USER BOOKING ACTIONS -------------------------

export const fetchUserBookingsInit = () => {
    return {
        type: FETCH_USER_BOOKINGS_INIT
    };
};

export const fetchUserBookingsSuccess = (userBookings) => {
    return {
        type: FETCH_USER_BOOKINGS_SUCCESS,
        userBookings: userBookings
    };
};

export const fetchUserBookingsFail = (errors) => {
    return {
        type: FETCH_USER_BOOKINGS_FAIL,
        errors: errors
    };
};

export const fetchUserBookings = () => {
    return dispatch => {
        dispatch(fetchUserBookingsInit());
        axiosInstance.get('/bookings/manage')
            .then((res) => res.data)
            .then((userBookings) => dispatch(fetchUserBookingsSuccess(userBookings)))
            .catch(({response}) => dispatch(fetchUserBookingsFail(response.data.errors)));
    }
};

// USER RENTALS ACTIONS -------------------------

export const getUserRentals = () => {
    return axiosInstance.get('/rentals/manage').then(
        (response) => {
            return response.data;
        },
        (error) => {
            return Promise.reject(error.response.data.errors);
        });
};

export const deleteRental = (rentalId) => {
    return axiosInstance.delete(`/rentals/${rentalId}`).then(
        res => res.data,
        err => Promise.reject(err.response.data.errors)
    );
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
    const username = authService.getUsername();
    return {
        type: LOGIN_SUCCESS,
        username: username
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
