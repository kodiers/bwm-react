import React from 'react';

import {toUpperCase, rentalType} from 'helpers';

import * as actions from '../../../actions';
import {RentalAssets} from "./RentalAssets";
import {EditableInput} from "../../shared/editable/EditableInput";


export class RentalDetailUpdate extends React.Component {

    constructor() {
        super();
        this.updateRental = this.updateRental.bind(this);
    }

    updateRental(rentalData) {
        const {rental: {_id}, dispatch} = this.props;
        dispatch(actions.updateRental(_id, rentalData));
    }

    render() {
        const rental = this.props.rental;
        return (
            <div className='rental'>
                <h1>Update</h1>
                <h2 className={`rental-type ${rental.category}`}>{rentalType(rental.shared)} {rental.category}</h2>
                <div className='rental-owner'>
                    <img src='https://api.adorable.io/avatars/285/abott@adorable.png' alt='owner'/>
                    <span>{rental.user && rental.user.username}</span>
                </div>
                <EditableInput
                    entity={rental}
                    entityField={'title'}
                    className={'rental-title'}
                    updateEntity={this.updateRental}/>
                <h2 className='rental-city'>{toUpperCase(rental.city)}</h2>
                <div className='rental-room-info'>
                    <span><i className='fa fa-building'></i>{rental.bedrooms} bedrooms</span>
                    <span><i className='fa fa-user'></i> {rental.bedrooms + 4} guests</span>
                    <span><i className='fa fa-bed'></i> {rental.bedrooms + 2} beds</span>
                </div>
                <p className='rental-description'>
                    {rental.description}
                </p>
                <hr></hr>
                <RentalAssets/>
            </div>
        );
    }

}
