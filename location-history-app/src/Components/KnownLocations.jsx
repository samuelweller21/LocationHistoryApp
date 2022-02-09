
import React, { Component, useEffect, useState } from 'react'
import LocationService from '../api/LocationService';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-tabs/style/react-tabs.css';
import L from 'leaflet'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Location from './Location.js'
import 'leaflet/dist/leaflet.css'
import KnownLocation from './KnownLocation'
import { Button, InputGroup, Row, Col, FormControl, Container } from 'react-bootstrap'
import '../App.css'
import { Modal } from 'react-bootstrap'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

class KnownLocations extends Component {

    constructor() {
        super()
        this.state = {
            position: [51.505, -0.09],
            timestamp: 1,
            date: null,
            create: false,
            modalPosition: [51.505, -0.09],
            modalRange: 50,
        }

        // Function binings

        this.getLocation = this.getLocation.bind(this)
        this.nextLocation = this.nextLocation.bind(this)
        this.knownLocationClicked = this.knownLocationClicked.bind(this)
        this.deleteKnownLocation = this.deleteKnownLocation.bind(this)
        this.updateModalPosition = this.updateModalPosition.bind(this)
    }

    updateModalPosition(latlng) {
        this.setState({ modalPosition: [latlng.lat, latlng.lng] })
    }

    componentDidMount() {
        LocationService.getKnownLocations().then((res) => {
            console.log(res.data)
            this.setState({ locations: res.data })
        })
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    getLocation() {
        LocationService.getLocation().then(res => {
            this.setState({ position: [res.data.lat, res.data.lng], timestamp: res.data.timestamp })
            const { map } = this.state;
            if (map) map.flyTo(this.state.position);
        }).catch(e => console.log(e))
    }

    nextLocation() {
        LocationService.nextLocation(this.state.timestamp).then(res => {
            console.log("Recieved")
            this.setState({
                position: [res.data.lat, res.data.lng],
                timestamp: res.data.timestamp,
                date: new Date(res.data.timestamp).toLocaleString()
            })
            const { map } = this.state;
            if (map) map.flyTo(this.state.position);
        }).catch(e => console.log(e))
    }

    knownLocationClicked(lat, lng) {
        this.setState({ position: [lat, lng] }, () => this.state.map.flyTo(this.state.position, 14, { duration: 2 }))
    }

    deleteKnownLocation(name) {
        LocationService.deleteKnownLocation(name).then((res1) => {
            LocationService.getKnownLocations().then((res2) => {
                this.setState({ locations: res2.data }, () => console.log(this.state.locations))
            })
        })

    }

    render() {
        // Hard code in height and width for now
        let style = { width: 1500, height: 800 }

        return (
            <div>
                <div className="row">
                    <div className="col-lg-4">
                        <Button onClick={() => this.setState({ create: true })} style={{ margin: 7 }}> Create new Known Location </Button>
                    </div>
                </div>
                <div className="divider">

                </div>
                <div class="row">
                    <div class="col-lg-2">
                        {(this.state.locations == null) ? [] : this.state.locations.map((loc) =>
                            <KnownLocation
                                name={loc.name}
                                clickCallback={() => this.knownLocationClicked(loc.lat, loc.lng)}
                                deleteCallback={() => this.deleteKnownLocation(loc.name)}
                            />)}
                    </div>
                    <div class="col-lg-10">
                        <MapContainer
                            style={{ width: this.state.width / 2, height: this.state.height / 2 }}
                            center={this.state.position}
                            zoom={13}
                            scrollWheelZoom={true}
                            whenCreated={map => this.setState({ map })}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker position={this.state.position}>
                                <Popup>Lat: {this.state.position[0]} , Lng: {this.state.position[1]} </Popup>
                            </Marker>

                        </MapContainer>
                    </div>
                </div>

                {/* Modal */}

                {(this.state.create) ?
                    <Modal dialogClassName="my-modal" show={this.state.create} onHide={() => this.setState({ create: false })}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create new known location</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <Container>

                                <Row>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon1">Location Name</InputGroup.Text>
                                        <FormControl
                                            onChange={(event) => this.setState({ klName: event.target.value })}
                                            placeholder="Location Name"
                                            aria-label="Location Name"
                                            aria-describedby="basic-addon1"
                                        />
                                    </InputGroup>
                                </Row>

                                <div>Range:</div>

                                <RangeSlider
                                    value={this.state.modalRange}
                                    onChange={changeEvent => this.setState({ modalRange: changeEvent.target.value })}
                                />

                                <FormControl
                                    value={this.state.modalRange}
                                    onChange={changeEvent => this.setState({ modalRange: changeEvent.target.value })}
                                    placeholder="Location"
                                    aria-label="Location Name"
                                    aria-describedby="basic-addon1"
                                />

                            </Container>

                            <MapContainer
                                style={{ width: this.state.width * 0.88, height: this.state.height / 2 }}
                                center={this.state.map.getCenter()}
                                zoom={this.state.map.getZoom()}
                                scrollWheelZoom={true}
                                whenCreated={mapCreate => this.setState({ mapCreate })}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <Circle center={this.state.modalPosition} radius={this.state.modalRange} />

                                <ModalMarker updateModalPosition={this.updateModalPosition} position={this.state.modalPosition}>
                                    <Popup>Lat: {this.state.modalPosition[0]} , Lng: {this.state.modalPosition[1]} </Popup>
                                </ModalMarker>

                            </MapContainer>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => this.setState({ create: false })} variant="secondary">
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                this.setState({ create: false })
                                LocationService.createKnownLocation(this.state.klName, this.state.modalPosition[0], this.state.modalPosition[1], this.state.modalRange).then(() => {
                                    LocationService.getKnownLocations().then((res2) => {
                                        this.setState({ locations: res2.data }, () => console.log(this.state.locations))
                                    })
                                })
                            }} variant="success">
                                Create
                            </Button>
                        </Modal.Footer>
                    </Modal> : null}

            </div>
        )
    }
}

function ModalMarker(props) {
    const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

    const map = useMapEvents({
        click(event) {
            const { lat, lng } = event.latlng;
            props.updateModalPosition(event.latlng)
            setPosition({
                latitude: lat,
                longitude: lng,
            });
        },
    });

    return (
        position.latitude !== 0 ? (
            <Marker
                position={[position.latitude, position.longitude]}
                interactive={false}
            />
        ) : null)
}

export default KnownLocations