import 'bootstrap/dist/css/bootstrap.min.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import LandingPage from './Components/LandingPage/LandingPage';
import LogInPage from './Components/LogInPage';
import Prototype from './Components/Prototype.jsx';

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

    <Router>
      <Switch>
        <Route exact path="/home">
          {console.log("Intercepted home")}
          <Prototype />
        </Route>

        <Route exact path="/login">
          {console.log("Intercepted login")}
          <LogInPage />
        </Route>

        <Route exact path="/welcome">
          {console.log("Intercepted welcome")}
          <LandingPage />
        </Route>

        <Route path="/">
          {console.log("Intercepted nothing")}
          <Prototype />
        </Route>

        <Route>
          <Prototype />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
