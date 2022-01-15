import axios from 'axios'

class LocationService {

    getLocation() {
        return axios.get("http://localhost:8080/location")
    }

    nextLocation(timestamp) {
        return axios.get(`http://localhost:8080/nextlocation/${timestamp}`)
    }

}

export default new LocationService()