import React, { Component } from "react";
import {
  withGoogleMap,
  GoogleMap,
  Polyline,
  Marker
} from "react-google-maps";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: []
    };
  }

  velocity = 5;
  initialDate = new Date();

  getDistance = () => {
    // seconds between when the component loaded and now
    const differentInTime = (new Date() - this.initialDate) / 1000; // pass to seconds
    return differentInTime * this.velocity; // d = v*t -- thanks Newton!
  };

  componentDidMount = () => {
    this.interval = window.setInterval(this.moveObject, 1000);
    console.log(this.props.path);
  };

  componentWillUnmount = () => {
    window.clearInterval(this.interval);
  };

  moveObject = () => {
    const distance = this.getDistance();
    if (!distance) {
      return;
    }

    let progress = this.path.filter(
      coordinates => coordinates.distance < distance
    );

    const nextLine = this.path.find(
      coordinates => coordinates.distance > distance
    );
    if (!nextLine) {
      this.setState({ progress });
      return; // it's the end!
    }
    const lastLine = progress[progress.length - 1];

    const lastLineLatLng = new window.google.maps.LatLng(
      lastLine.lat,
      lastLine.lng
    );

    const nextLineLatLng = new window.google.maps.LatLng(
      nextLine.lat,
      nextLine.lng
    );

    // distance of this line
    const totalDistance = nextLine.distance - lastLine.distance;
    const percentage = (distance - lastLine.distance) / totalDistance;

    const position = window.google.maps.geometry.spherical.interpolate(
      lastLineLatLng,
      nextLineLatLng,
      percentage
    );

    progress = progress.concat(position);
    this.setState({ progress });
  };

  componentWillMount = () => {
    this.path = this.props.path.map((coordinates, i, array) => {
      if (i === 0) {
        return { ...coordinates, distance: 0 }; // it begins here!
      }
      const { lat: lat1, lng: lng1 } = coordinates;
      const latLong1 = new window.google.maps.LatLng(lat1, lng1);

      const { lat: lat2, lng: lng2 } = array[0];
      const latLong2 = new window.google.maps.LatLng(lat2, lng2);

      // in meters:
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
        latLong1,
        latLong2
      );

      return { ...coordinates, distance };
    });

    console.log(this.path);
  };

  render() {
    const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: 6.8667528, lng: 79.8769134 }}
      >
        {this.state.progress && (
          <>
            <Polyline
              path={this.state.progress}
              options={{ strokeColor: "#FF0000 " }}
            />
            <Marker
              position={this.state.progress[this.state.progress.length - 1]}
            />
          </>
        )}
      </GoogleMap>
    ));

    return (
      <div>
        <GoogleMapExample
          containerElement={<div style={{ height: `500px`, width: "500px" }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}

export default Map;
