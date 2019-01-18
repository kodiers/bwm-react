import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Circle, InfoWindow} from "react-google-maps";
import {Cacher} from "../../services/cacher";

function MapComponent(props) {
    const {coordinates, isError, isLocationLoaded} = props;
    return (
        <GoogleMap
            defaultZoom={13}
            defaultCenter={coordinates}
            center={coordinates}
            options={{disableDefaultUI: isError ? true : false}}>
            {isLocationLoaded && !isError && <Circle center={coordinates} radius={500}/>}
            {isLocationLoaded && isError && <InfoWindow position={coordinates} options={{maxWidth: 300}}>
                <div>
                    Something going wrong!
                </div>
            </InfoWindow>}
        </GoogleMap>
    );
}

function withGeocode(WrappedComponent) {
    return class extends React.Component {

        constructor() {
            super();
            this.state = {
                coordinates: {
                    lat: 0,
                    lng: 0
                },
                isError: false,
                isLocationLoaded: false
            };
            this.cacher = new Cacher();
        }

        componentWillMount() {
            this.getGeocodedLocation();
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            if (this.props.isReloading) {
                this.getGeocodedLocation();
            }
        }

        render() {
            return (
                <WrappedComponent {...this.state}/>
            );
        }

        updateCoordinates(coordinates) {
            this.props.mapLoaded();
            this.setState({
                coordinates: coordinates,
                isLocationLoaded: true
            });
        }

        geocodeLocation(location) {
            const geocoder = new window.google.maps.Geocoder();
            return new Promise((resolve, reject) => {
                geocoder.geocode({address: location}, (result, status) => {
                    if (status === 'OK') {
                        const geometry = result[0].geometry.location;
                        const coordinates = {lat: geometry.lat(), lng: geometry.lng()};
                        this.cacher.cacheValue(location, coordinates);

                        resolve(coordinates);
                    } else {
                        reject('ERROR');
                    }
                });
            })
        }

        getGeocodedLocation() {
            const location = this.props.location;
            if (this.cacher.isValueCached(location)) {
                this.updateCoordinates(this.cacher.getCacheValue(location));
            } else {
                this.geocodeLocation(location).then(
                    (coordinates) => {
                        this.updateCoordinates(coordinates);
                    },
                    (error) => {
                        this.props.mapLoaded();
                        this.setState({
                            isError: true,
                            isLocationLoaded: true
                        });
                    });
            }

        }
    }
}

export const MapWithGeocode = withScriptjs(withGoogleMap(withGeocode(MapComponent)));
