import './App.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import { useState } from 'react';
import Prototype from "./Components/Prototype.jsx"
import 'bootstrap/dist/css/bootstrap.min.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function App() {
  return (
    <Prototype></Prototype>
  );
}

export default App;
