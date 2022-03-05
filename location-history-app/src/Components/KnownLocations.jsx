
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css';
import 'leaflet/dist/leaflet.css';
import React, { Component, useState } from 'react';
import { Button, Col, Container, Form, FormControl, InputGroup, Modal, Row } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import "react-datepicker/dist/react-datepicker.css";
import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'react-tabs/style/react-tabs.css';
import LocationService from '../api/LocationService';
import '../App.css';
import KnownLocation from './KnownLocation';

class KnownLocations extends Component {

    constructor() {
        super()
        this.state = {
            position: [51.505, -0.09],
            timestamp: 1,
            locations: [],
            date: null,
            create: false,
            modalPosition: [0, 0],
            modalRange: 50,
            drawCircles: false,
            loading: false,
            edit: false,
            editOldName: null,
            editName: null,
            editDesc: null,
            editRange: null,
            editPos: [],
            height: window.innerHeight,
            width: window.innerWidth
        }

        this.getLocation = this.getLocation.bind(this)
        this.nextLocation = this.nextLocation.bind(this)
        this.knownLocationClicked = this.knownLocationClicked.bind(this)
        this.deleteKnownLocation = this.deleteKnownLocation.bind(this)
        this.updateModalPosition = this.updateModalPosition.bind(this)
        this.updateEditModalPosition = this.updateEditModalPosition.bind(this)
    }

    updateModalPosition(latlng) {
        this.setState({ modalPosition: [latlng.lat, latlng.lng] })
    }

    updateEditModalPosition(latlng) {
        this.setState({ editPos: [latlng.lat, latlng.lng] })
    }

    componentDidMount() {
        // Rerender on resize
        window.addEventListener('resize', () => {
            this.setState({ height: window.innerHeight, width: window.innerWidth })
        })

        LocationService.getKnownLocations().then((res) => {
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

    editKnownLocationClicked(name) {
        let kl = this.state.locations.find(e => e.name === name)
        this.setState({ editOldName: name, edit: true, editName: kl.name, editPos: [kl.lat, kl.lng], editRange: kl.radius, editDesc: kl.description })
    }

    render() {
        return (
            <div>
                <Container fluid="xs">

                    <Row>
                        <Col xs={2}>
                            <Row>
                                <Button onClick={() => this.setState({ create: true })} style={{ margin: 7 }}> Create new Known Location </Button>
                            </Row>
                            <Row>
                            <Col style={{height: 0.8*this.state.height}} xs={12} className="scrollable" >
                            {(this.state.locations == null) ? [] : this.state.locations.map((loc) =>
                                <KnownLocation
                                    key={loc.name}
                                    name={loc.name}
                                    clickCallback={() => this.knownLocationClicked(loc.lat, loc.lng)}
                                    deleteCallback={() => this.deleteKnownLocation(loc.name)}
                                    editCallback={() => this.editKnownLocationClicked(loc.name)}
                                />)}
                            </Col>
                            </Row>
                            <Row>
                            {this.state.loading ? <Button variant="warning"> Waiting for server </Button> : null}
                            </Row>
                        </Col>
                        <Col xs={10}>
                            <MapContainer
                                style={{ width: 0.82 * this.state.width, height: 0.83 * this.state.height }}
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

                                {/* <ZoomControl position="topright"></ZoomControl> */}

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
                                        <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
                                        <FormControl
                                            onChange={(event) => this.setState({ klName: event.target.value })}
                                            placeholder="Location Name"
                                            aria-label="Location Name"
                                            aria-describedby="basic-addon1"
                                        />
                                    </InputGroup>
                                </Row>

                                <Row>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon1">Description</InputGroup.Text>
                                        <FormControl
                                            onChange={(event) => this.setState({ klDesc: event.target.value })}
                                            placeholder="Location Description"
                                            aria-label="Location Description"
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

                                {(this.state.editModalPosition != null) ? <Circle center={this.state.editModalPosition} radius={this.state.editModalRange} /> : null}

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
                                LocationService.createKnownLocation(this.state.klName, this.state.modalPosition[0], this.state.modalPosition[1], this.state.modalRange, this.state.klDesc).then(() => {
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

                {/* Edit model */}

                {(this.state.edit) ?
                    <Modal dialogClassName="my-modal" show={this.state.edit} onHide={() => this.setState({ edit: false })}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Known Location</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <Container>

                                <Row>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
                                        <FormControl
                                            value={this.state.editName}
                                            onChange={(event) => this.setState({ editName: event.target.value })}
                                            aria-label="Location Name"
                                            aria-describedby="basic-addon1"
                                        />
                                    </InputGroup>
                                </Row>

                                <Row>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon1">Description</InputGroup.Text>

                                        <FormControl
                                            value={this.state.editDesc}
                                            onChange={(event) => this.setState({ editDesc: event.target.value })}
                                            placeholder="Location Description"
                                            aria-label="Location Description"
                                            aria-describedby="basic-addon1"
                                        />
                                    </InputGroup>
                                </Row>

                                <div>Range:</div>

                                <RangeSlider
                                    value={this.state.editRange}
                                    onChange={changeEvent => this.setState({ editRange: changeEvent.target.value })}
                                />

                                <FormControl
                                    style={{ margin: 10 }}
                                    value={this.state.editRange}
                                    onChange={changeEvent => this.setState({ editRange: changeEvent.target.value })}
                                    aria-describedby="basic-addon1"
                                />

                            </Container>

                            <MapContainer
                                style={{ width: this.state.width * 0.88, height: this.state.height / 2 }}
                                center={this.state.map.getCenter()}
                                zoom={this.state.map.getZoom()}
                                scrollWheelZoom={true}
                                whenCreated={mapEdit => this.setState({ mapEdit }, () => this.state.mapEdit.flyTo(this.state.editPos))}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {(this.state.editPos != null) ? <Circle center={this.state.editPos} radius={this.state.editRange} /> : null}

                                <ModalMarker updateModalPosition={this.updateEditModalPosition} position={this.state.editPos}>
                                    <Popup>Lat: {this.state.editPos[0]} , Lng: {this.state.editPos[1]} </Popup>
                                </ModalMarker> : null

                            </MapContainer>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => this.setState({ edit: false })} variant="secondary">
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                this.setState({ loading: true })
                                this.setState({ edit: false })
                                console.log("About to delete; " + this.state.editOldName)
                                LocationService.deleteKnownLocation(this.state.editOldName).then(
                                    LocationService.createKnownLocation(this.state.editName, this.state.editPos[0], this.state.editPos[1], this.state.editRange, this.state.editDesc).then(() => {
                                        LocationService.getKnownLocations().then((res2) => {
                                            this.setState({ locations: res2.data }, () => console.log(this.state.locations))
                                            this.setState({ loading: false })
                                        })
                                    })).catch(e => {
                                        console.log(e)
                                        this.setState({ loading: false })
                                    })
                            }} variant="success">
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal> : null}
            </div>
        )
    }
}

function ModalMarker() {
    const [position] = useState({ latitude: 0, longitude: 0 });

    return (
        position.latitude !== 0 ? (
            <Marker
                position={[position.latitude, position.longitude]}
                interactive={false}
            />
        ) : null)
}

export default KnownLocations