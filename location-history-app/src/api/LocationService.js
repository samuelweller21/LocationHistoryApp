import axios from 'axios'

class LocationService {

    // Moving around

    getLocation() {
        return axios.get("http://localhost:8080/location")
    }

    nextLocation(timestamp) {
        return axios.get(`http://localhost:8080/nextLocation/sweller/${timestamp}`)
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

}

export default new LocationService()