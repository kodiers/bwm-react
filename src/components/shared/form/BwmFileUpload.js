import React from 'react';


export class BwmFileUpload extends React.Component {

    constructor() {
        super();
        this.setupReader();
        this.onChange = this.onChange.bind(this);
        this.state = {
            selectedFile: undefined,
            imageBase64: ''
        };
    }

    setupReader() {
        this.reader = new FileReader();
        this.reader.addEventListener('load', (event) => {
            this.setState({imageBase64: event.target.result});
        });
    }

    onChange(event) {
        const {input: {onChange}} = this.props;
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            this.setState({selectedFile: selectedFile});
            this.reader.readAsDataURL(selectedFile);
        }
    }

    uploadImage() {}

    render() {
        const {label, meta: {touched, error}} = this.props;
        const {selectedFile, imageBase64} = this.state;
        return (
            <div className='img-upload-container'>
                <label className='img-upload btn btn-bwm'>
                    <span className='upload-text'>Select an image</span>
                    <input type='file' accept='.jpg, .png, .jpeg' onChange={this.onChange}/>
                </label>
                { selectedFile &&
                    <button
                        className='btn btn-success btn-upload'
                        type='button'
                        disabled={!selectedFile}
                        onClick={() => this.uploadImage()}>Upload image</button>
                }
                { touched &&
                    ((error && <div className='alert alert-danger'>{error}</div>))
                }
                { imageBase64 &&
                    <div className='img-preview-container'>
                        <div className='img-preview' style={{'backgroundImage': 'url(' + imageBase64 + ')'}}></div>
                    </div>
                }
            </div>
        );
    }
}
