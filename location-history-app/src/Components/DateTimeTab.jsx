
import React, { Component } from 'react'
import LocationService from '../api/LocationService';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class DateTimeTab extends Component {

    constructor() {
        super()
        this.state = { position: [51.505, -0.09], timestamp: 1, date: null }
        this.getLocation = this.getLocation.bind(this)
        this.nextLocation = this.nextLocation.bind(this)
    }

    getLocation() {
        LocationService.getLocation().then(res => {
            console.log(res.data)
            this.setState({ position: [res.data.lat, res.data.lng], timestamp: res.data.timestamp })
            const { map } = this.state;
            if (map) map.flyTo(this.state.position);
        }).catch(e => console.log(e))
    }

    nextLocation() {
        LocationService.nextLocation(this.state.timestamp).then(res => {
            this.setState({
                position: [res.data.lat, res.data.lng],
                timestamp: res.data.timestamp,
                date: new Date(res.data.timestamp).toLocaleString()
            })
            const { map } = this.state;
            if (map) map.flyTo(this.state.position);
        }).catch(e => console.log(e))
    }

    render() {
        // Hard code in height and width for now
        let style = {width: 1500, height: 800}
        return (
            <div class="row">
                <div class="col-lg-2">
                    <DatePicker
                        selected={new Date()}
                        showTimeSelect
                        dateFormat="Pp"
                    />
                    <div class="hellodiv"> Hello </div>
                    <button onClick={this.getLocation}>Get location</button>
                    <button onClick={this.nextLocation}>Next location</button>
                    <label>{this.state.date}</label>
                </div>
                <div class="col-lg-10">
                    <MapContainer style={style} center={this.state.position} zoom={13} scrollWheelZoom={true} whenCreated={map => this.setState({ map })}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={this.state.position}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        )
    }
}


export default DateTimeTab