
import React, { Component } from 'react'
import LocationService from '../api/LocationService';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle, Polyline } from 'react-leaflet'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, InputGroup, Row, Col, FormControl, Container, Form, FormCheck } from 'react-bootstrap'
import { hello_line } from '../res/hello.js'
import L from 'leaflet';

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

class DateTimeTab extends Component {

    constructor() {
        super()
        this.state = {
            position: [51.505, -0.09],
            timestamp: 1,
            date: new Date("07/07/2021").toString(),
            loading: false,
            first: new Date(),
            last: new Date(),
            emptyDay: false,
            colours: null,
            drawCircles: false,
            accuracy: 10,
            lines: hello_line.map(i => [i[1], i[0]]),
            width: window.innerWidth,
            height: window.innerHeight
        }

    }

    componentDidMount() {
        this.setState({ loading: true })
        // Rerender on resizes
        window.addEventListener('resize', () => {
            this.setState({ height: window.innerHeight, width: window.innerWidth })
        })
        LocationService.getFirstLastDates().then(res => {
            this.setState({ first: new Date(res.data[0]), last: new Date(res.data[1]) })
        }).then(
            LocationService.getColours().then(res => {
                this.setState({ colours: res.data, loading: false })
            })).catch(e => {
                console.log(e)
                this.setState({ loading: false })
            })

    }

    dateChanged(date) {
        this.setState({ loading: true })
        LocationService.getLocationsOnDate(date).then(res => {
            this.setState({ emptyDay: false })
            this.setState({ lines: res.data.map(l => [l.lat, l.lng]) })
            this.setState({ points: res.data })
            this.setState({ loading: false })
            var latLngs = this.state.lines.map(function (pair) {
                return new L.LatLng(pair[0], pair[1]);
            });
            this.state.map.fitBounds(
                L.latLngBounds(latLngs),
                {padding: [50,50]}
            )
        }).catch(e => {
            this.setState({ loading: false })
            console.log(e)
        })
    }

    getDates(startDate, stopDate) {
        var dateArray = new Array();
        var currentDate = startDate;
        while (currentDate <= stopDate) {
            dateArray.push(new Date(currentDate));
            currentDate = currentDate.addDays(1);
        }
        return dateArray;
    }


    render() {
        let datesGreen = null
        let datesRed = null
        let highlightWithRanges = null
        if (this.state.colours !== null) {
            datesGreen = this.getDates(this.state.first, this.state.last)
            datesGreen = datesGreen.filter(d => this.state.colours[datesGreen.indexOf(d)])
            datesRed = this.getDates(this.state.first, this.state.last)
            datesRed = datesRed.filter(d => !this.state.colours[datesRed.indexOf(d)])
            highlightWithRanges = [
                {
                    "react-datepicker__day--highlighted-custom-1": datesRed,
                },
                {
                    "react-datepicker__day--highlighted-custom-2": datesGreen,
                },
            ];
        }
        return (
            <div>
                <Container fluid="xs">
                    <Row>
                        <Col xs={2}>
                            <Row align="center">
                                {highlightWithRanges !== null ? <DatePicker
                                    selected={new Date(this.state.date)}
                                    dateFormat="Pp"
                                    onChange={(date) => this.dateChanged(date)}
                                    inline
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    highlightDates={highlightWithRanges}
                                    minDate={this.state.first}
                                    maxDate={this.state.last}
                                /> :
                                    <DatePicker
                                        selected={new Date(this.state.date)}
                                        dateFormat="Pp"
                                        onChange={(date) => this.dateChanged(date)}
                                        inline
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        minDate={this.state.first}
                                        maxDate={this.state.last}
                                    />}
                            </Row>

                            <Row>
                                <label>{this.state.date}</label>
                                {(this.state.dailySummary != null || this.state.dailySummary == "") ? this.state.dailySummary.map(ds =>
                                    (ds.m == 0 && ds.h == 0) ? null : <div>
                                        {ds.name} : {ds.h} hours {ds.m} minutes
                                    </div>) : null}
                                {this.state.loading ? <Button variant="warning"> Waiting for server </Button> : null}
                                {this.state.emptyDay ? <Button variant="warning"> No locations on that day </Button> : null}
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
                                {(this.state.drawCircles) ? this.state.points.map(l =>
                                    <Circle center={[l.lat, l.lng]} radius={l.accuracy} />
                                )
                                    : null}
                                <Polyline pathOptions={{ color: 'blue' }} positions={this.state.lines} />
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


export default DateTimeTab