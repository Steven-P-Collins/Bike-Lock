import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

import CurrentLocation from './CurrentLocation';

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {}
    };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    onClose = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    render() {
        return (
            <CurrentLocation
                centerAroundCurrentLocation
                google={this.props.google}
            >
                <Marker onClick={this.onMarkerClick} name={'Current Location'} />
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                >
                    <div>
                        <h4>{this.state.selectedPlace.name}</h4>
                    </div>
                </InfoWindow>
            </CurrentLocation>
        );
    }
}

export class SearchBox extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        onPlacesChanged: PropTypes.func
    };

    render() {
        return <input ref="input" {...this.props} type="text"/>;
    }
    onPlacesChanged = () => {
        if (this.props.onPlacesChanged) {
            this.props.onPlacesChanged(this.searchBox.getPlaces());
        }
    };
    componentDidMount() {
        const {google} = this.props;

        var input = ReactDOM.findDOMNode(this.refs.input);
        this.searchBox = new google.maps.places.SearchBox(input);
        this.searchBox.addListener('places_changed', this.onPlacesChanged);
    };
    componentWillUnmount() {
        const {google} = this.props;
        // https://developers.google.com/maps/documentation/javascript/events#removing
        google.maps.event.clearInstanceListeners(this.searchBox);
    };
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAXjF_A8Tp4XiVM7fh5HvVRqo8mBpxMIOQ'
})(MapContainer, SearchBox);