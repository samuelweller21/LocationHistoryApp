import axios from 'axios'

class LocationService {

    // Moving around

    getLocation() {
        return axios.get("http://localhost:8080/location")
    }

    nextLocation(timestamp) {
        return axios.get(`http://localhost:8080/nextLocation/sweller/${timestamp}`)
    }

    nextDay(timestamp) {
        return axios.get(`http://localhost:8080/nextDay/sweller/${timestamp}`)
    }

    previousLocation(timestamp) {
        return axios.get(`http://localhost:8080/previousLocation/sweller/${timestamp}`)
    }

    previousDay(timestamp) {
        return axios.get(`http://localhost:8080/previousDay/sweller/${timestamp}`)
    }

    getLocationOnDate(rawDate) {
        let date = rawDate.toLocaleString()
        return axios.post(`http://localhost:8080/getLocationOnDate/sweller`, {date})
    }

    // Known Locations

    getKnownLocations() {
        return axios.get(`http://localhost:8080/getKnownLocations/sweller`)
    }

    deleteKnownLocation(name) {
        console.log("Trying to delete " + name)
        return axios.post(`http://localhost:8080/removeKnownLocation/sweller/${name}`)
    }

    createKnownLocation(name, lat, lng, radius) {
        console.log("Trying to create " + name + " : " + lat + " : " + lng)
        return axios.post(`http://localhost:8080/addKnownLocation/sweller/${name}/${lat}/${lng}/${radius}`)
    }

    // Daily Summary

    getDailySummary(date) {
        return axios.get(`http://localhost:8080/getDailySummary/sweller/${date}`)
    }

    // Date picker formatting

    getFirstDate() {
        return axios.get(`http://localhost:8080/firstDate/sweller`)
    }

    getLastDate() {
        return axios.get(`http://localhost:8080/lastDate/sweller`)
    }

    getFirstLastDates() {
        return axios.get(`http://localhost:8080/firstLastDates/sweller`)
    }

    getColours() {
        return axios.get(`http://localhost:8080/getColours/sweller`)
    }

}

export default new LocationService()