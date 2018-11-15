import React from 'react';

import {connect} from 'react-redux';

import {RentalCard} from "./RentalCard";

class RentalList extends React.Component {

    renderRentals() {
        return this.props.rentals.map((rental, index) => {
            return (
                <RentalCard key={index}
                            rental={rental}/>
            );
        });
    }

    render() {
        return (
            <section id='rentalListing'>
                <h1 className='page-title'>Your Home All Around the World</h1>
                <div className='row'>
                    {this.renderRentals()}
                </div>
            </section>
        );
    }
}

function mapStateToProps(state) {
    return {
        rentals: state.rentals
    };
}

export default connect(mapStateToProps)(RentalList);
