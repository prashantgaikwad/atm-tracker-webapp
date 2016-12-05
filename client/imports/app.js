import { default as React, Component } from "react";
import FaSpinner from "react-icons/lib/fa/spinner";
import AsyncGoogleMap from './map';
import { findIndex } from 'lodash';

const userId = Meteor.uuid();
function getLocation(showPosition) {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  } else {
      console.log("Geolocation is not supported by this browser.");
  }
}

export default class AsyncGettingStartedExample extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.fetch = this.fetch.bind(this);
    this.onCenterChange = this.onCenterChange.bind(this);
    this.state = { password: 'Prashant G @_CodeRunner', value: 'NO_CASH', mapOptions: { zoom: 14, center: { lat: 18.516726, lng: 73.856223 } } };
  }

  handleMapLoad(map) {
    this._mapComponent = map;
  }

  handleMapClick(event) {
    // if (this.state.isMobile) {
    //   return;
    // }
    // const marker = {
    //     position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
    //     defaultAnimation: 2,
    //     key: Date.now(),
    //     updatedAt: new Date(),
    //     status: 'NO_CASH',
    //     userId,
    //   };
    // Atms.insert(marker);
    // this.setState({ mapOptions: { center: event.latLng, zoom: this.getZoom() }});
  }

  handleMarkerRightClick(targetMarker) {
    if(this.state.password === '#ATMWithCash') {
      Meteor.call('Atm.remove', targetMarker._id, () => {
        this.onCenterChange();
      });
    }
  }

  getZoom() {
    const currentZoom = this._mapComponent.getZoom();
    return currentZoom > 16 ? currentZoom : 16;
  }

  onSubmit(status, id) {
    Meteor.call('Atm.update', id, status, () => {
      this.onCenterChange();
    });
  }

  fetch() {
    const center = this._mapComponent.getCenter();
    Meteor.call('Places.fetch', { lat: center.lat(), lng: center.lng() });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  onCenterChange() {
    const center = this._mapComponent.getCenter();
    const centerObj = { lat: center.lat(), lng: center.lng() };
    const bounds = this._mapComponent.getBounds();
    this.props.onCenterChange(centerObj, bounds, this.state.password);
  }

  render() {
    const { password } = this.state;
    const { isMobile } = this.props;
    const height = window.innerHeight - 100;
    const fetchButton = password === '#ATMWithCash' ? (
      <button style={{ margin: 5, height: 25 }} type="button" onClick={this.fetch}>Fetch</button>
    ) : '';
    return (
      <div>
          <AsyncGoogleMap
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFt6UaBxOQ7Jhdp7MHZrGQ0t2PSq3yXxQ&libraries=geometry,drawing,places"
            loadingElement={
              <div style={{ height: `100%` }}>
                <FaSpinner
                  style={{
                    display: `block`,
                    width: `80px`,
                    height: `80px`,
                    margin: `150px auto`,
                    animation: `fa-spin 2s infinite linear`,
                  }}
                />
              </div>
            }
            containerElement={
              <div style={{ height: height }} />
            }
            mapElement={
              <div style={{ height: height }} />
            }
            onMapLoad={this.handleMapLoad}
            onMapClick={this.handleMapClick}
            onMarkerRightClick={this.handleMarkerRightClick}
            onSubmit={this.onSubmit}
            mapOptions={this.state.mapOptions}
            markers={this.props.atms}
            onCenterChange={this.onCenterChange}
            isMobile={isMobile}
          />
        <div>
          <input style={{ margin: 5 }}
            value={password}
            type="text" onChange={this.handlePasswordChange}
          />
          {fetchButton}
        </div>
      </div>
    );
  }
}
