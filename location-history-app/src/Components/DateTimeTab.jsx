
import React, { Component } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'react-tabs/style/react-tabs.css';
import LocationService from '../api/LocationService';

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
            dailySummary: [],
            width: window.innerWidth,
            height: window.innerHeight
        }

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
            if (res.data !== "") {
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
            if (res.data !== "") {
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
            if (res.data !== "") {
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
            if (res.data !== "") {
                this.setState({ dailySummary: res.data });
            }
            this.setState({ loading: false })
        }).catch(e => {
            console.log(e)
            this.setState({ loading: false })
        })
    }


    dateChanged(date) {
        this.setState({ loading: true })
        LocationService.getDailySummary(date).then(res => {
            if (res.data !== "") {
                this.setState({ emptyDay: false })
                this.setState({ dailySummary: res.data, date: date.toString() })
                LocationService.getLocationOnDate(date.toLocaleDateString()).then(res => {
                    if (res.data !== "") {
                        this.setState({ emptyDay: false })
                        this.setState({ position: [res.data.lat, res.data.lng], timestamp: res.data.timestamp, accuracy: res.data.accuracy }, () => {
                            const { map } = this.state;
                            if (map) map.flyTo(this.state.position);
                            this.setState({ loading: false })
                        })
                    } else {
                        this.setState({ emptyDay: true, loading: false })
                    }
                })
            } else {
                this.setState({ emptyDay: true, loading: false })
            }
        }).catch(e => {
            this.setState({ loading: false })
            console.log(e)
        })
    }

    getDates(startDate, stopDate) {
        var dateArray = [];
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

                            <Row><Button style={{ margin: 5 }} onClick={this.nextLocation}>Next location</Button></Row>
                            <Row><Button style={{ margin: 5 }} onClick={this.nextDay}>Next Day</Button></Row>
                            <Row><Button style={{ margin: 5 }} onClick={this.previousLocation}>Previous location</Button></Row>
                            <Row><Button style={{ margin: 5 }} onClick={this.previousDay}>Previous Day</Button></Row>
                            <Row>
                                <label>{this.state.date}</label>
                                {(this.state.dailySummary !== null || this.state.dailySummary === "") ? this.state.dailySummary.map(ds =>
                                    (ds.m === 0 && ds.h === 0) ? null : <div>
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
                            <MapContainer style={{ width: "100%", height: this.state.height - 150}} center={this.state.position} zoom={13} scrollWheelZoom={true} whenCreated={map => this.setState({ map })}>
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


export default DateTimeTab