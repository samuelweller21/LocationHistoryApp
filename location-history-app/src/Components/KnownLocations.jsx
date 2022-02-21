
import React, { Component, useEffect, useState } from 'react'
import LocationService from '../api/LocationService';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle, ZoomControl } from 'react-leaflet'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-tabs/style/react-tabs.css';
import L from 'leaflet'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Location from './Location.js'
import 'leaflet/dist/leaflet.css'
import KnownLocation from './KnownLocation'
import { Button, InputGroup, Row, Col, FormControl, Container, Form, FormCheck } from 'react-bootstrap'
import '../App.css'
import { Modal } from 'react-bootstrap'
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import { geosearch } from 'esri-leaflet-geocoder'
import EsriLeafletGeoSearch from "react-esri-leaflet/plugins/EsriLeafletGeoSearch"
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css'
import { BasemapLayer, FeatureLayer } from 'react-esri-leaflet'

class KnownLocations extends Component {

    constructor() {
        super()
        this.state = {
            position: [51.505, -0.09],
            timestamp: 1,
            date: null,
            create: false,
            modalPosition: [0, 0],
            modalRange: 50,
            drawCircles: false,
            loading: false
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
        this.setState({ loading: true })
        LocationService.getLocation().then(res => {
            this.setState({ position: [res.data.lat, res.data.lng], timestamp: res.data.timestamp })
            const { map } = this.state;
            if (map) map.flyTo(this.state.position);
            this.setState({ loading: false })
        }).catch(e => {
            console.log(e)
            this.setState({ loading: false })
        })
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
        this.setState({ loading: true })
        LocationService.deleteKnownLocation(name).then((res1) => {
            LocationService.getKnownLocations().then((res2) => {
                this.setState({ locations: res2.data }, () => console.log(this.state.locations))
                this.setState({ loading: false })
            })
        }).catch(e => {
            console.log(e)
            this.setState({ loading: false })
        })

    }

    render() {
        // Hard code in height and width for now
        let style = { width: 0.8*window.innerWidth, height: 0.82*window.innerHeight }

        return (
            <div>
            <Container fluid="xs">
  
                <Row>
                    <Col xs={2}>
                    <Button onClick={() => this.setState({ create: true })} style={{ margin: 7 }}> Create new Known Location </Button>
                        {(this.state.locations == null) ? [] : this.state.locations.map((loc) =>
                            <KnownLocation
                                name={loc.name}
                                clickCallback={() => this.knownLocationClicked(loc.lat, loc.lng)}
                                deleteCallback={() => this.deleteKnownLocation(loc.name)}
                            />)}
                        {this.state.loading ? <Button variant="warning"> Waiting for server </Button> : null}
                    </Col>
                    <Col xs={10}>
                        <MapContainer
                            style={style}
                            center={this.state.position}
                            zoom={13}
                            scrollWheelZoom={true}
                            whenCreated={map => this.setState({ map })}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {/* <BasemapLayer name="DarkGray" /> */}
                            {/* <FeatureLayer url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} /> */}

                            <ZoomControl position="topright"></ZoomControl>

                            {/* <EsriLeafletGeoSearch useMapBounds={false} position="topright" /> */}

                            {(this.state.drawCircles) ? this.state.locations.map(loc =>
                                <Circle center={[loc.lat, loc.lng]} radius={loc.radius} />)
                                : null}

                            {(this.state.locations != null) ? this.state.locations.map(loc =>
                                <Marker position={[loc.lat, loc.lng]}>
                                    <Popup>
                                        Name: {loc.name} <dd></dd>
                                        Description: {loc.description} <dd></dd>
                                        Lat: {loc.lat} <dd></dd>
                                        Lng: {loc.lng}  <dd></dd>
                                    </Popup>
                                </Marker>
                            ) : null}

                        </MapContainer>
                        <Form>
                            <Form.Check
                                type={'checkbox'}
                                label={`Draw boundaries`}
                                onClick={(event) => { this.setState({ drawCircles: event.target.checked }) }}
                            />
                        </Form>
                    </Col>
                </Row>
                </Container>

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
                                    style={{ margin: 10 }}
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

                                {(this.state.modalPosition != null) ? <Circle center={this.state.modalPosition} radius={this.state.modalRange} /> : null}

                                <ModalMarker updateModalPosition={this.updateModalPosition} position={this.state.modalPosition}>
                                    <Popup>Lat: {this.state.modalPosition[0]} , Lng: {this.state.modalPosition[1]} </Popup>
                                </ModalMarker> : null

                            </MapContainer>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => this.setState({ create: false })} variant="secondary">
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                this.setState({ loading: true })
                                this.setState({ create: false })
                                LocationService.createKnownLocation(this.state.klName, this.state.modalPosition[0], this.state.modalPosition[1], this.state.modalRange).then(() => {
                                    LocationService.getKnownLocations().then((res2) => {
                                        this.setState({ locations: res2.data }, () => console.log(this.state.locations))
                                        this.setState({ loading: false })
                                    })
                                }).catch(e => {
                                    console.log(e)
                                    this.setState({ loading: false })
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