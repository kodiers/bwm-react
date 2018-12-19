import React from 'react';

import * as actions from '../../../actions';


export class RentalManage extends React.Component {
    constructor() {
        super();
        this.state = {
            userRentals: [],
            errors: []
        };
    }

    componentWillMount() {
        actions.getUserRentals().then(
            (userRentals) => {
                this.setState({
                    userRentals: userRentals
                });
            },
            (errors) => {
                this.setState({errors: errors});
            });
    }

    render() {
        const {userRentals} = this.state;
        return (
            <div>
                {userRentals.map((rental, index) => {
                    return <p key={index}>{rental.title}</p>
                })}
            </div>
        );
    }
}
