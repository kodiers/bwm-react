import React from 'react';

import {connect} from 'react-redux';

import * as actions from '../../../actions';
import RentalMap from "./RentalMap";
import Booking from "../../booking/Booking";
import {UserGuard} from "../../shared/auth/UserGuard";
import {EditableSelect} from "../../shared/editable/EditableSelect";
import {EditableInput} from "../../shared/editable/EditableInput";
import {EditableText} from "../../shared/editable/EditableText";
import {EditableImage} from "../../shared/editable/EditableImage";
import {RentalAssets} from "./RentalAssets";
import {toUpperCase} from "../../../helpers";


class RentalUpdate extends React.Component {

    constructor() {
        super();
        this.state = {
            isAllowed: false,
            isFetching: true
        };
        this.updateRental = this.updateRental.bind(this);
        this.resetRentalError = this.resetRentalError.bind(this);
        this.verifyRentalOwner = this.verifyRentalOwner.bind(this);
    }

    componentWillMount() {
        const rentalId = this.props.match.params.id;
        this.props.dispatch(actions.fetchRentalById(rentalId));
    }

    componentDidMount() {
        this.verifyRentalOwner();
    }

    updateRental(rentalData) {
        const {rental: {_id}, dispatch} = this.props;
        dispatch(actions.updateRental(_id, rentalData));
    }

    resetRentalError() {
        this.props.dispatch(actions.resetRentalErrors());
    }

    verifyRentalOwner() {
        const rentalId = this.props.match.params.id;
        this.setState({isFetching: true});
        return actions.verifyRentalOwner(rentalId).then(
            () => {
                this.setState({isAllowed: true, isFetching: false});
            },
            () => {
                this.setState({isAllowed: false, isFetching: false});
            });
    }

    render() {
        const {rental, errors} = this.props;
        const {isFetching, isAllowed} = this.state;
        if (rental._id) {
            return (
                <UserGuard isAllowed={isAllowed} isFetching={isFetching}>
                    <section id='rentalDetails'>
                        <div className='upper-section'>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <EditableImage
                                        entity={rental}
                                        entityField={'image'}
                                        errors={errors}
                                        updateEntity={this.updateRental}/>
                                </div>
                                <div className='col-md-6'>
                                    <RentalMap location={`${rental.city}, ${rental.street}`}/>
                                </div>
                            </div>
                        </div>

                        <div className='details-section'>
                            <div className='row'>
                                <div className='col-md-8'>
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
                                </div>
                                <div className='col-md-4'>
                                    <Booking rental={rental}/>
                                </div>
                            </div>
                        </div>
                    </section>
                </UserGuard>
            );
        }
        return (
            <h1>Loading</h1>
        );
    }
}

function mapStateToProps(state) {
    return {
        rental: state.rental.data,
        errors: state.rental.errors
    };
}

export default connect(mapStateToProps)(RentalUpdate);
