import './App.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'
import { useState } from 'react';
import Prototype from "./Components/Prototype.jsx"
import 'bootstrap/dist/css/bootstrap.min.css';
import Map from './Components/TestComponent.js'

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function App() {

//   (function() {
//     var cors_api_host = 'cors-anywhere.herokuapp.com';
//     var cors_api_url = 'https://' + cors_api_host + '/';
//     var slice = [].slice;
//     var origin = window.location.protocol + '//' + window.location.host;
//     var open = XMLHttpRequest.prototype.open;
//     XMLHttpRequest.prototype.open = function() {
//         var args = slice.call(arguments);
//         var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
//         if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
//             targetOrigin[1] !== cors_api_host) {
//             args[1] = cors_api_url + args[1];
//         }
//         return open.apply(this, args);
//     };
// })();

  return (
    // <Map apikey={process.env.ARCGIS_API_KEY} />
    <Prototype></Prototype>
  );
}

export default App;
