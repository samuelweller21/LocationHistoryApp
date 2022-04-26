import axios from 'axios';
import { createBrowserHistory } from 'history';

var SERVER = "http://localhost:8080"
//const SERVER = "http://myfirstapp-env.eba-rygdbhqj.us-east-1.elasticbeanstalk.com"

class LocationService {

    constructor() {
        // axios.interceptors.request.use(request => {
        //     console.log('Starting Request', JSON.stringify(request, null, 2))
        //     return request
        //   })
        // axios.interceptors.response.use(response => {
        // console.log('Response:', JSON.stringify(response, null, 2))
        // return response
        // })

        axios.interceptors.response.use(response => response, err => {
            if (err.status = 403) {
                // Go to log in page
                console.log("going to login")
                createBrowserHistory().push('/login');
                window.location.reload();

                }
            console.log(err.status)
            return Promise.reject(err)
        })

    }

    // Authentication

    authenticate(username, password) {
        return axios.post(this.getDomain() + `/authenticate`, {username: username, password: password})
    }

    test() {
        return axios.post(this.getDomain() + `/test`);
    }

    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }

    // Moving around

    nextLocation(timestamp) {
        return axios.get(this.getDomain() + `/nextLocation/${timestamp}`)
    }

    getDomain() {
        return SERVER
    }

    nextDay(timestamp) {
        return axios.get(this.getDomain() + `/nextDay/${timestamp}`)
    }

    previousLocation(timestamp) {
        return axios.get(this.getDomain() + `/previousLocation/${timestamp}`)
    }

    previousDay(timestamp) {
        return axios.get(this.getDomain() + `/previousDay/${timestamp}`)
    }

    getLocationOnDate(rawDate) {
        let date = rawDate.toLocaleString()
        return axios.post(this.getDomain() + `/getLocationOnDate`, {date})
    }

    getAllLocations() {
        return axios.get(this.getDomain() + `/getAllLocations`)
    }

    getVacations() {
        let homeCountry = "United Kingdom"
        return axios.get(this.getDomain() + `/getVacations/${homeCountry}`)
    }

    getLocationsFromTo(startDate, endDate) {
        let mix = [startDate, endDate]
        return axios.post(this.getDomain() + `/getAllLocationsFromTo`, {mix})
    }

    // Known Locations

    getKnownLocations() {
        return axios.get(this.getDomain() + `/getKnownLocations`)
    }

    deleteKnownLocation(name) {
        console.log("Trying to delete " + name)
        return axios.post(this.getDomain() + `/removeKnownLocation${name}`)
    }

    createKnownLocation(name, lat, lng, radius, desc) {
        console.log("Trying to create " + name + " : " + lat + " : " + lng)
        return axios.post(this.getDomain() + `/addKnownLocation/${name}/${lat}/${lng}/${radius}/${desc}`)
    }

    // Daily Summary

    getDailySummary(date) {
        return axios.get(this.getDomain() + `/getDailySummary/${date}`)
    }

    // Date picker formatting

    getFirstDate() {
        return axios.get(this.getDomain() + `/firstDate`)
    }

    getLastDate() {
        return axios.get(this.getDomain() + `/lastDate`)
    }

    getFirstLastDates() {
        return axios.get(this.getDomain() + `/firstLastDates`)
    }

    getColours() {
        return axios.get(this.getDomain() + `/getColours`)
    }

}

export default new LocationService()