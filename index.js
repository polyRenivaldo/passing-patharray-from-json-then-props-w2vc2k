import React, { Component } from 'react';
import { render } from 'react-dom';
import { withScriptjs } from 'react-google-maps';
import Map from './Map';
import './style.css';
import jsonPath from './data.json';

const App = () => {
  const MapLoader = withScriptjs(Map);

  return (
    <MapLoader
      path={jsonPath}
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCsZXToFWJsqG3j_3ISqNqyd3hn4BnwgY4&libraries=geometry,places"
      loadingElement={<div style={{ height: `100%` }} />}
    />
  );
};

render(<App />, document.getElementById('root'));
