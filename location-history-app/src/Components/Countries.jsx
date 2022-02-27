
import React, { Component } from 'react'
import LocationService from '../api/LocationService';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, InputGroup, Row, Col, FormControl, Container, Form, FormCheck } from 'react-bootstrap'
import { countries } from '../res/countries.js'

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

class Countries extends Component {

    constructor() {
        super()
        this.state = {
            position: [51.505, -0.09],
            date: new Date("07/07/2021").toString(),
            loading: false,
            drawCircles: false,
            countries: countries,
            vacations: [],
            width: window.innerWidth,
            height: window.innerHeight
        }

        LocationService.getVacations().then(res => {
            console.log(res.data)
            this.setState({vacations: res.data})
            this.setState({ loading: false })
        })

        console.log(this.state.countries)

        this.nextLocation = this.nextLocation.bind(this)
        this.previousLocation = this.previousLocation.bind(this)
        this.nextDay = this.nextDay.bind(this)
        this.previousDay = this.previousDay.bind(this)
    }

    componentDidMount() {
        this.setState({ loading: true })
        // Rerender on resize
        window.addEventListener('resize', () => {
            this.setState({ height: window.innerHeight, width: window.innerWidth })
        })
    }

    nextLocation() {
        this.setState({ loading: true })
        LocationService.nextLocation(this.state.timestamp).then(res => {
            this.setState({
                position: [res.data.lat, res.data.lng],
                timestamp: res.data.timestamp,
                accuracy: res.data.accuracy,
                date: new Date(res.data.timestamp * 1000).toString()
            })
            const { map } = this.state;
            if (map) map.flyTo(this.state.position);
        })
        LocationService.getDailySummary(new Date(this.state.date)).then(res => {
            if (res.data != "") {
                this.setState({ dailySummary: res.data })
            }
            this.setState({ loading: false })
        }).catch(e => {
            console.log(e)
            this.setState({ loading: false })
        })
    }

    previousLocation() {
        LocationService.previousLocation(this.state.timestamp).then(res => {
            this.setState({
                position: [res.data.lat, res.data.lng],
                timestamp: res.data.timestamp,
                accuracy: res.data.accuracy,
                date: new Date(res.data.timestamp * 1000).toString()
            })
            const { map } = this.state;
            if (map) map.flyTo(this.state.position);
        }).catch(e => console.log(e))
        LocationService.getDailySummary(new Date(this.state.date)).then(res => {
            if (res.data != "") {
                this.setState({ dailySummary: res.data })
            }
            this.setState({ loading: false })
        }).catch(e => {
            console.log(e)
            this.setState({ loading: false })
        })
    }

    nextDay() {
        LocationService.nextDay(this.state.timestamp).then(res => {
            this.setState({
                position: [res.data.lat, res.data.lng],
                timestamp: res.data.timestamp,
                accuracy: res.data.accuracy,
                date: new Date(res.data.timestamp * 1000).toString()
            })
            const { map } = this.state;
            if (map) map.flyTo(this.state.position);
        }).catch(e => console.log(e))
        LocationService.getDailySummary(new Date(this.state.date)).then(res => {
            if (res.data != "") {
                this.setState({ dailySummary: res.data })
            }
            this.setState({ loading: false })
        }
        ).catch(e => {
            console.log(e)
            this.setState({ loading: false })
        })
    }

    previousDay() {
        LocationService.previousDay(this.state.timestamp).then(res => {
            this.setState({
                position: [res.data.lat, res.data.lng],
                timestamp: res.data.timestamp,
                accuracy: res.data.accuracy,
                date: new Date(res.data.timestamp * 1000).toString()
            })
            const { map } = this.state;
            if (map) map.flyTo(this.state.position);
        }).catch(e => console.log(e))
        LocationService.getDailySummary(new Date(this.state.date)).then(res => {
            if (res.data != "") {
                this.setState({ dailySummary: res.data });
            }
            this.setState({ loading: false })
        }).catch(e => {
            console.log(e)
            this.setState({ loading: false })
        })
    }


    render() {
        
        return (
            <div>
                <Container fluid="xs">
                    <Row>
                        <Col xs={2}>
                           
                            <Row><Button style={{ margin: 5 }} onClick={this.nextLocation}>Next location</Button></Row>
                            <Row><Button style={{ margin: 5 }} onClick={this.nextDay}>Next Day</Button></Row>
                            <Row><Button style={{ margin: 5 }} onClick={this.previousLocation}>Previous location</Button></Row>
                            <Row><Button style={{ margin: 5 }} onClick={this.previousDay}>Previous Day</Button></Row>
                            <Row>
                                <label>{this.state.date}</label>
                                {(this.state.dailySummary != null || this.state.dailySummary == "") ? this.state.dailySummary.map(ds =>
                                    (ds.m == 0 && ds.h == 0) ? null : <div>
                                        {ds.name} : {ds.h} hours {ds.m} minutes
                                    </div>) : null}
                                {this.state.loading ? <Button variant="warning"> Waiting for server </Button> : null}
                                {this.state.emptyDay ? <Button variant="warning"> No locations on that day </Button> : null}
                                {this.state.vacations.map(c => 
                                {console.log(c.startDate)
                                let date = new Date(c.startDate)
                                return (
                                <div>
                                    {c.countryName + " " + monthNames[date.getMonth()] + " " + date.getFullYear()}
                                </div>)})}
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
                                {(this.state.drawCircles) ?
                                    <Circle center={[this.state.position[0], this.state.position[1]]} radius={this.state.accuracy} />
                                    : null}
                                <Marker position={this.state.position}>
                                    <Popup>
                                        Date/Time: {new Date(this.state.timestamp * 1000).toString().substring(0, 24)}
                                        <br />
                                        Lat: {this.state.position[0]}
                                        <br />
                                        Lng: {this.state.position[1]}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}


export default Countries