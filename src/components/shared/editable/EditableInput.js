import React from 'react';


export class EditableInput extends React.Component {

    constructor() {
        super();
        this.state = {
            isActive: false,
            value: undefined,
            originValue: undefined
        };
    }

    componentDidMount() {
        const {entity, entityField} = this.props;
        const value = entity[entityField];
        this.setState({value: value, originValue: value});
    }

    disableEdit() {
        this.setState({isActive: false});
    }

    enableEdit() {
        this.setState({isActive: true});
    }

    update() {
        const {value, originValue} = this.state;
        const {updateEntity, entityField} = this.props;
        if (value !== originValue) {
            updateEntity({[entityField]: value});
            this.setState({isActive: false, originValue: value})
        }
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
                <span className={className}>{value}</span>
                <button type='button' className='btn btn-warning btn-editable' onClick={() => this.enableEdit()}>Edit</button>
            </React.Fragment>
        );
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <div id='editableComponent'>
                {this.renderComponentView()}
            </div>
        )
    }
}
