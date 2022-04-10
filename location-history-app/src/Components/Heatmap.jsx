
import L from 'leaflet';
import 'leaflet.heat';
import React, { Component, useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'react-tabs/style/react-tabs.css';
import LocationService from '../api/LocationService';

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function HeatmapFunction(props) {
    const map = useMap()

    useEffect(() => {
        const points = props.loc
            ? props.loc.map((p) => {
                return [p.lat, p.lng, 0.3]; // lat lng intensity
            })
            : [];

        L.heatLayer(points, { minOpacity: 0.5 }, { radius: 25 }, { blur: 15 }).addTo(map);
    }, []);

    return null;
}

class Heatmap extends Component {

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
    }

    componentDidMount() {
        this.setState({ loading: true })

        // Rerender on resize
        window.addEventListener('resize', () => {
            this.setState({ height: window.innerHeight, width: window.innerWidth })
        })

        LocationService.getAllLocations().then(res => {
            this.setState({ AllLocations: res.data })
            console.log("Loaded locations")
        }).then(
            LocationService.getFirstLastDates().then(res => {
                this.setState({ first: new Date(res.data[0]), last: new Date(res.data[1]) })
            }).then(
                LocationService.getColours().then(res => {
                    // Force update as colours is not a direct input into react component
                    this.setState({ colours: res.data, loading: false }, () => {
                        let datesGreen = null
                        let datesRed = null
                        let highlightWithRanges = null
                        if (this.state.colours !== null) {
                            datesGreen = this.getDates(this.state.first, this.state.last)
                            datesGreen = datesGreen.filter(d => this.state.colours[datesGreen.indexOf(d)])
                            datesRed = this.getDates(this.state.first, this.state.last)
                            datesRed = datesRed.filter(d => !this.state.colours[datesRed.indexOf(d)])

                            this.setState({ datesRed: datesRed, datesGreen: datesGreen, key: Math.random() })
                        }
                    })
                }
                )).catch(e => {
                    console.log(e)
                    this.setState({ loading: false })
                }))


        let datesGreen = null
        let datesRed = null
        let highlightWithRanges = null
        if (this.state.colours !== null) {
            datesGreen = this.getDates(this.state.first, this.state.last)
            datesGreen = datesGreen.filter(d => this.state.colours[datesGreen.indexOf(d)])
            datesRed = this.getDates(this.state.first, this.state.last)
            datesRed = datesRed.filter(d => !this.state.colours[datesRed.indexOf(d)])
        }

        this.setState({ datesRed: datesRed, datesGreen: datesGreen, key: Math.random() })
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

    dateChanged(date) {
        this.setState({ startDate: date[0], endDate: date[1] }, () => {
            LocationService.getLocationsFromTo(this.state.startDate, this.state.endDate).then((res) => {
                this.setState({ AllLocations: res.data, key2: Math.random() })
            })
        })

        // LocationService.getDailySummary(date).then(res => {
        //     if (res.data !== "") {
        //         this.setState({ emptyDay: false })
        //         this.setState({ dailySummary: res.data, date: date.toString() })
        //         LocationService.getLocationOnDate(date.toLocaleDateString()).then(res => {
        //             if (res.data !== "") {
        //                 this.setState({ emptyDay: false })
        //                 this.setState({ position: [res.data.lat, res.data.lng], timestamp: res.data.timestamp, accuracy: res.data.accuracy }, () => {
        //                     const { map } = this.state;
        //                     if (map) map.flyTo(this.state.position);
        //                     this.setState({ loading: false })
        //                 })
        //             } else {
        //                 this.setState({ emptyDay: true, loading: false })
        //             }
        //         })
        //     } else {
        //         this.setState({ emptyDay: true, loading: false })
        //     }
        // }).catch(e => {
        //     this.setState({ loading: false })
        //     console.log(e)
        // })
    }

    render() {
        console.log("first:" + this.state.first)
        console.log("last:" + this.state.last)
        try {
            console.log("highlight: " + this.state.highlight[0].Object)
        } catch (err) {

        }
        return (
            <div>
                <Container fluid="xs">
                    <Row>
                        <Col xs={2}>
                            <Row align="center">

                                <Button onClick={() => this.setState({startDate: this.state.first, endDate: this.state.endDate}, () => {
                                    LocationService.getAllLocations().then((res) => {
                                        this.setState({ AllLocations: res.data, key2: Math.random() })
                                    })
                                })}>Reset calendar</Button>

                                {this.state.datesRed !== null && this.state.datesGreen ? <DatePicker
                                    key={this.state.key}
                                    selected={this.state.startDate}
                                    dateFormat="Pp"
                                    onChange={(date) => this.dateChanged(date)}
                                    inline
                                    showMonthDropdown
                                    showYearDropdown
                                    selectsRange
                                    dropdownMode="select"
                                    highlightDates={[
                                        {
                                            "react-datepicker__day--highlighted-custom-1": this.state.datesRed,
                                        },
                                        {
                                            "react-datepicker__day--highlighted-custom-2": this.state.datesGreen,
                                        },
                                    ]}
                                    minDate={this.state.first}
                                    maxDate={this.state.last}
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                /> :
                                    <DatePicker
                                        key={this.state.key}
                                        selected={this.state.startDate}
                                        dateFormat="Pp"
                                        onChange={(date) => this.dateChanged(date)}
                                        inline
                                        selectsRange
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        minDate={this.state.first}
                                        maxDate={this.state.last}
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                    />}

                            </Row>

                            <Row>
                                {this.state.loading ? <Button variant="warning"> Waiting for server </Button> : null}
                                {this.state.emptyDay ? <Button variant="warning"> No locations on that day </Button> : null}
                            </Row>
                        </Col>
                        <Col xs={10}>
                            <MapContainer
                                key={this.state.key2}
                                style={{ width: 0.82 * this.state.width, height: 0.85 * this.state.height }}
                                center={this.state.position}
                                zoom={13}
                                scrollWheelZoom={true}
                                whenCreated={map => this.setState({ map })}
                                maxZoom={15}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {this.state.AllLocations ? <HeatmapFunction loc={this.state.AllLocations}></HeatmapFunction> : null}

                            </MapContainer>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}


export default Heatmap