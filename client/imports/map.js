import { flowRight } from "lodash";
import { default as React, Component } from "react";
import { withGoogleMap, GoogleMap, Marker, Polyline, InfoWindow } from "react-google-maps";
import DrawingManager from "react-google-maps/lib/drawing/DrawingManager";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";
import AtmForm from "./details";
import MapControl from './map-control';

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = { markers: props.markers };
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMarkerClose = this.handleMarkerClose.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({ markers: newProps.markers })
  }

  handleMapLoad(map) {
    this._mapComponent = map;
    this.props.onMapLoad(map);
  }

  handleMarkerClose(targetMarker, index) {
    const { markers } = this.state;
    markers[index].showInfo = false;
    this.setState({ markers });
  }

  handleMarkerClick(targetMarker, index) {
    const { markers } = this.state;
    markers[index].showInfo = true;
    this.setState({ markers, mapOptions: { center: targetMarker.position, zoom: this.getZoom() }});
  }

  getZoom() {
    const currentZoom = this._mapComponent.getZoom();
    return currentZoom > 16 ? currentZoom : 16;
  }

 render() {
  const { onMapClick, onOverlayComplete, mapOptions, onMarkerRightClick, onMarkerClose, onMarkerClick, onSubmit, onCenterChange } = this.props;
    const moreProps = {};
    if (mapOptions.center) {
      moreProps.center= mapOptions.center;
    }
    const { markers=[] } = this.state;
    return (
      <GoogleMap
        ref={this.handleMapLoad}
        defaultZoom={15}
        defaultCenter={{ lat: 18.516726, lng: 73.856223 }}
        defaultOptions={{
          streetViewControl: false,
          mapTypeControl: false,
          minZoom: 13,
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: 1
          }
        }}
      >
      <MapControl>
        <div style={{ margin: 10, zoom: 1.3 }}>
          <button style={{ height: 25 }} onClick={onCenterChange}>Search this area</button>
        </div>
      </MapControl> 
        {markers.map((marker, index) => {
          let icon = '';
          switch (marker.status) {
            case 'CASH_AVAILABLE_SHORT_QUEUE':
              icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|00FF00';
              break;
            case 'NO_CASH' :
              icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FFFFFF';
              break;
            case 'CASH_AVAILABLE_LONG_QUEUE':
              icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|0000FF';
              break;
            default:
              icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FFFFFF';
              break;
          }
          return(
            <Marker
              {...marker}
              icon={icon}
              onRightClick={() => onMarkerRightClick(marker)}
              onClick={() => this.handleMarkerClick(marker, index)}
            >
            {marker.showInfo && (
              <InfoWindow onCloseClick={() => this.handleMarkerClose(marker, index)}>
                <AtmForm onSubmit={onSubmit}
                  marker={marker}
                  onRemoveMarker={onMarkerRightClick}
                />
              </InfoWindow>
            )}
            </Marker>)
        })}
      </GoogleMap>
    );
  }
}

const AsyncGoogleMap = flowRight(withScriptjs, withGoogleMap)(Map);

export default AsyncGoogleMap;