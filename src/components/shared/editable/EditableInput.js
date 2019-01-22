import React from 'react';

import {EditableComponent} from "./EditableComponent";

export class EditableInput extends EditableComponent {

    formatView(value) {
        const {formatPipe} = this.props;
        if (formatPipe && formatPipe.length > 0) {
            let formattedValue = value;
            formatPipe.forEach(pipe => { formattedValue = pipe(formattedValue)});
            return formattedValue;
        }
        return value;
    }

    renderComponentView() {
        const {value, isActive} = this.state;
        const {className} = this.props;

        if (isActive) {
            return (
                <React.Fragment>
                    <input value={value} onChange={(event) => this.handleChange(event)} className={className}/>
                    <button type='button'
                            className='btn btn-success btn-editable'
                            onClick={() => this.update()}>Save</button>
                    <button type='button'
                            className='btn btn-warning btn-editable'
                            onClick={() => this.disableEdit()}>Close</button>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <span className={className}>{this.formatView(value)}</span>
                <button type='button' className='btn btn-warning btn-editable' onClick={() => this.enableEdit()}>Edit</button>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className='editableComponent' style={this.props.cotainerStyle}>
                {this.renderComponentView()}
            </div>
        )
    }
}
