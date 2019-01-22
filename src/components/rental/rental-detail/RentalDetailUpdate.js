import React from 'react';

import {toUpperCase } from 'helpers';
import { toast } from 'react-toastify';

import * as actions from '../../../actions';
import {RentalAssets} from "./RentalAssets";
import {EditableInput} from "../../shared/editable/EditableInput";
import {EditableText} from "../../shared/editable/EditableText";
import {EditableSelect} from "../../shared/editable/EditableSelect";


export class RentalDetailUpdate extends React.Component {

    constructor() {
        super();
        this.updateRental = this.updateRental.bind(this);
        this.resetRentalError = this.resetRentalError.bind(this);
    }

    updateRental(rentalData) {
        const {rental: {_id}, dispatch} = this.props;
        dispatch(actions.updateRental(_id, rentalData));
    }

    resetRentalError() {
        this.props.dispatch(actions.resetRentalErrors());
    }

    render() {
        const {rental, errors} = this.props;
        if (errors && errors.length > 0) {
            toast.error(errors[0].detail);
        }
        return (
            <div className='rental'>
                <label className={`rental-label rental-type ${rental.category}`}>Shared</label>
                <EditableSelect
                    entity={rental}
                    entityField={'shared'}
                    className={`rental-type ${rental.category}`}
                    options={[true, false]}
                    cotainerStyle={{'display': 'inline-block'}}
                    errors={errors}
                    resetRentalError={this.resetRentalError}
                    updateEntity={this.updateRental}/>
                <EditableSelect
                    entity={rental}
                    entityField={'category'}
                    className={`rental-type ${rental.category}`}
                    options={['apartment', 'house', 'condo']}
                    errors={errors}
                    resetRentalError={this.resetRentalError}
                    updateEntity={this.updateRental}/>
                <div className='rental-owner'>
                    <img src='https://api.adorable.io/avatars/285/abott@adorable.png' alt='owner'/>
                    <span>{rental.user && rental.user.username}</span>
                </div>
                <EditableInput
                    entity={rental}
                    entityField={'title'}
                    className={'rental-title'}
                    errors={errors}
                    resetRentalError={this.resetRentalError}
                    updateEntity={this.updateRental}/>
                <EditableInput
                    entity={rental}
                    entityField={'city'}
                    className={'rental-city'}
                    errors={errors}
                    formatPipe={[toUpperCase]}
                    resetRentalError={this.resetRentalError}
                    updateEntity={this.updateRental}/>
                <EditableInput
                    entity={rental}
                    entityField={'street'}
                    className={'rental-street'}
                    errors={errors}
                    resetRentalError={this.resetRentalError}
                    updateEntity={this.updateRental}/>
                <div className='rental-room-info'>
                    <span><i className='fa fa-building'></i>
                        <EditableInput
                            entity={rental}
                            entityField={'bedrooms'}
                            className={'rental-bedrooms'}
                            errors={errors}
                            resetRentalError={this.resetRentalError}
                            cotainerStyle={{'display': 'inline-block'}}
                            updateEntity={this.updateRental}/> bedrooms
                    </span>
                    <span><i className='fa fa-user'></i> {rental.bedrooms + 4} guests</span>
                    <span><i className='fa fa-bed'></i> {rental.bedrooms + 2} beds</span>
                </div>
                <EditableText
                    entity={rental}
                    entityField={'description'}
                    className={'rental-description'}
                    updateEntity={this.updateRental}
                    errors={errors}
                    resetRentalError={this.resetRentalError}
                    rows={6}
                    cols={50}/>
                <hr></hr>
                <RentalAssets/>
            </div>
        );
    }

}
