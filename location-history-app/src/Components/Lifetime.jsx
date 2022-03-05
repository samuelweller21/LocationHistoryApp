
import React, { Component } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import { Circle, MapContainer, TileLayer } from 'react-leaflet';
import 'react-tabs/style/react-tabs.css';
import LocationService from '../api/LocationService';

class DateTimeTab extends Component {

    constructor() {
        super()
        this.state = {
            position: [51.505, -0.09],
            locations: [],
            loading: false,
            drawCircles: false,
            width: window.innerWidth,
            height: window.innerHeight
        }

    }

    componentDidMount() {
        this.setState({ loading: true })
        LocationService.getAllLocations().then(res => {
            console.log(res.data)
            this.setState({locations: res.data})
            this.setState({ loading: false })
        })
        // Rerender on resizes
        window.addEventListener('resize', () => {
            this.setState({ height: window.innerHeight, width: window.innerWidth })
        })
    }

    render() {
        return (
            <div>
                <Container fluid="xs">
                    <Row>
                        <Col xs={2}>
                            <Row>
                                {this.state.loading ? <Button variant="warning"> Waiting for server </Button> : null}
                            </Row>
                            <Row>
                                <Form>
                                    <Form.Check
                                        type={'checkbox'}
                                        label={`Draw boundaries`}
                                        onClick={(event) => { this.setState({ drawCircles: event.target.checked }) }}
                                    />
                                </Form>
                            </Row>
                        </Col>
                        <Col xs={10}>
                            <MapContainer style={{ width: 0.82 * this.state.width, height: 0.85 * this.state.height }} center={this.state.position} zoom={13} scrollWheelZoom={true} whenCreated={map => this.setState({ map })}>
                                
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {(this.state.drawCircles) ? this.state.locations.map(l =>
                                    <Circle center={[l.lat, l.lng]} radius={l.accuracy} />
                                ): null}

                                {console.log(this.state.locations)}
{/* 
                                {this.state.locations.map((l) => 
                                    <Marker position={[l.lat, l.lng]}>
                                        <Popup>
                                        Date/Time: {new Date(l.timestamp * 1000).toString().substring(0, 24)}
                                        <br />
                                        Accuracy: {l.accuracy}
                                        <br />
                                        Lat: {l.lng}
                                        <br />
                                        Lng: {l.lat}
                                    </Popup>
                                    </Marker>
                                )} */}
   
                            </MapContainer>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}


export default DateTimeTab