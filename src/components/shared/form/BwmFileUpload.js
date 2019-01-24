import React from 'react';

import ReactCrop, {makeAspectCrop} from 'react-image-crop';
import { toast } from 'react-toastify';

import * as actions from '../../../actions';


export class BwmFileUpload extends React.Component {

    constructor() {
        super();
        this.setupReader();
        this.onChange = this.onChange.bind(this);
        this.state = {
            selectedFile: undefined,
            imageBase64: '',
            initialImageBase64: '',
            croppedImage: {},
            pending: false,
            status: 'INIT',
            crop: {}
        };
    }

    setupReader() {
        this.reader = new FileReader();
        this.reader.addEventListener('load', (event) => {
            const {initialImageBase64} = this.state;
            const imageBase64 = event.target.result;
            if (initialImageBase64) {
                this.setState({imageBase64: imageBase64});
            } else {
                this.setState({imageBase64: imageBase64, initialImageBase64: imageBase64});
            }
        });
    }

    resetToDefaultState(status) {
        this.setState({
            selectedFile: undefined,
            imageBase64: '',
            initialImageBase64: '',
            croppedImage: {},
            pending: false,
            status: status,
        });
    }

    onChange(event) {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            this.setState({selectedFile: selectedFile, initialImageBase64: ''});
            this.reader.readAsDataURL(selectedFile);
        }
    }

    onCropChange(crop) {
        this.setState({ crop });
    }

    async onCropCompleted(crop, pixelCrop) {
        const {selectedFile, initialImageBase64} = this.state;
        if (selectedFile && (pixelCrop.height > 0 && pixelCrop.width > 0)) {
            const img = new Image();
            img.src = initialImageBase64;
            const croppedImage = await getCroppedImg(img, pixelCrop, selectedFile.name);
            this.setState({croppedImage});
            this.reader.readAsDataURL(croppedImage);
        }
    }

    onImageLoaded(image) {
        if (image.naturalWidth < 950 && image.naturalHeight < 720) {
            this.resetToDefaultState('INIT');
            toast.error("Minimum width of image is 950 and height 720");
            return;
        }
        this.setState({
            crop: makeAspectCrop({
                x: 0,
                y: 0,
                aspect: 4 / 3,
                width: 50
            }, image.width / image.height)
        });
    }

    onError(error) {
        this.setState({pending: false, status: 'FAIL'});
    }

    onSuccess(uploadedImage) {
        const {onChange} = this.props.input || this.props;
        this.resetToDefaultState('OK');
        this.setState({pending: false, status: 'OK'});
        onChange(uploadedImage);
    }

    renderSpinningCircle() {
        const {pending} = this.state;
        if (pending) {
            return (
                <div className='img-loading-overlay'>
                    <div className='img-spinning-circle'></div>
                </div>
            )
        }
    }

    renderImageStatus() {
        const {status} = this.state;
        if (status === 'OK') {
            return <div className='alert alert-success'>Image uploaded successfully</div>
        }
        if (status === 'FAIL') {
            return <div className='alert alert-danger'>Image upload failed</div>
        }
    }

    uploadImage() {
        const {croppedImage} = this.state;

        if (croppedImage) {
            this.setState({pending: true, status: 'INIT'});
            actions.uploadImage(croppedImage).then(
                (uploadedImage) => {
                    this.onSuccess(uploadedImage);
                },
                (error) => {
                    this.onError(error);
                });
        }
    }

    render() {
        const {selectedFile, imageBase64, crop, initialImageBase64} = this.state;
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
                {initialImageBase64 && <ReactCrop
                                    crop={crop}
                                    src={initialImageBase64}
                                    onChange={(crop) => this.onCropChange(crop)}
                                    onComplete={(crop, pixelCrop) => this.onCropCompleted(crop, pixelCrop)}
                                    onImageLoaded={(image) => this.onImageLoaded(image)} />}
                { imageBase64 &&
                    <div className='img-preview-container'>
                        <div className='img-preview' style={{'backgroundImage': 'url(' + imageBase64 + ')'}}></div>
                        {this.renderSpinningCircle()}
                    </div>
                }
                {this.renderImageStatus()}
            </div>
        );
    }
}

function getCroppedImg(image, pixelCrop, fileName) {

    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            blob.name = fileName;
            resolve(blob);
        }, 'image/jpeg');
    });
}
