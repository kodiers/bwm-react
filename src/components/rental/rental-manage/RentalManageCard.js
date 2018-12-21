import React from 'react';
import {Link} from "react-router-dom";

import {pretifyDate, toUpperCase} from "../../../helpers";


export class RentalManageCard extends React.Component {

    constructor() {
        super();
        this.state = {
            wantDelete: false
        };
    }

    showDeleteMenu() {
        this.setState({wantDelete: true});
    }

    closeDeletMenu() {
        this.setState({wantDelete: false});
    }

    deleteRental(rentalId, rentalIndex) {
        this.setState({wantDelete: false});
        this.props.deleteRentalCb(rentalId, rentalIndex);
    }

    render() {
        const {rental, modal, rentalIndex} = this.props;
        const {wantDelete} = this.state;
        const deleteClass = wantDelete ? 'toBeDeleted' : '';
        return (
            <div className='col-md-4'>
                <div className={`card text-center ${deleteClass}`}>
                    <div className='card-block'>
                        <h4 className='card-title'>{rental.title} - {toUpperCase(rental.city)}</h4>
                        <Link className='btn btn-bwm' to={`/rentals/${rental._id}`}>Go to Rental</Link>
                        {rental.bookings && rental.bookings.length > 0 && modal}
                    </div>
                    <div className='card-footer text-muted'>
                        Created at {pretifyDate(rental.createdAt)}
                        {
                            !wantDelete && <button className='btn btn-danger' onClick={() => {this.showDeleteMenu()}}>Delete</button>
                        }
                        {
                            wantDelete &&
                                <div className='deleteMenu'>
                                    Do you confirm?
                                    <button className='btn btn-danger' onClick={() => {this.deleteRental(rental._id, rentalIndex)}}>Yes</button>
                                    <button className='btn btn-success' onClick={() => this.closeDeletMenu()}>No</button>
                                </div>
                        }

                    </div>
                </div>
            </div>
        );
    }
}
