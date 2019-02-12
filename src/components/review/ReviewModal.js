import React from 'react';

import Modal from 'react-responsive-modal';
import {Link} from "react-router-dom";


export class ReviewModal extends React.Component {

    constructor() {
        super();
        this.state = {open: false};
    }

    closeModal() {
        this.setState({open: false});
    }

    publishReview = () => {};

    openModal() {
        this.setState({open: true});
    }

    render() {
        const {open} = this.state;

        return (
            <React.Fragment>
                <button className='btn btn-bwm' onClick={this.openModal} style={{marginLeft: '10px'}}>Review</button>
                <Modal open={open} onClose={() => this.closeModal} little classNames={{ modal: 'review-modal' }}>
                    <h4 className='modal-title title'>Write review</h4>
                    <div className='modal-body'>
                        Some text
                        Star rating
                    </div>
                    <div className='modal-footer'>
                        <button type='button' className='btn btn-bwm' onClick={this.publishReview} disabled={true}>Confirm</button>
                        <button type='button' onClick={() => this.closeModal} className='btn btn-bwm'>Cancel</button>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}
