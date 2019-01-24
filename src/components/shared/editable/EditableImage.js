import React from 'react';

import {EditableComponent} from "./EditableComponent";
import {BwmFileUpload} from "../form/BwmFileUpload";

export class EditableImage extends EditableComponent {

    constructor() {
        super();
        this.handleImageUpload = this.handleImageUpload.bind(this);
    }

    handleImageUpload(image) {
        this.setState({value: image});
        this.update();
    }

    render() {
        const {isActive, value} = this.state;

        return (
            <div className='editableComponent'>
                {
                    !isActive &&
                        <React.Fragment>
                            <img src={value} alt=''/>
                            <button
                                type='button'
                                className='btn btn-warning btn-editable btn-editable-img'
                                onClick={() => this.enableEdit()}>Edit</button>
                        </React.Fragment>
                }
                {
                    isActive &&
                        <React.Fragment>
                            <button type='button'
                                    className='btn btn-warning btn-editable btn-editable-img'
                                    onClick={() => this.disableEdit()}>Close</button>
                            <BwmFileUpload onChange={this.handleImageUpload}/>
                        </React.Fragment>
                }
            </div>
        )
    }
}
