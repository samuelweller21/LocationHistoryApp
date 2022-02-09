
import React, { Component, useEffect, useState } from 'react'
import LocationService from '../api/LocationService';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-tabs/style/react-tabs.css';
import L from 'leaflet'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Location from './Location.js'
import 'leaflet/dist/leaflet.css'
import { Button, Modal } from 'react-bootstrap'

class KnownLocation extends Component {

    constructor(props) {
        super()
        this.state = { areyousure: false }
    }

    render() {
        return (
            <div class="row">

                <div class="col-lg-4">
                    <a style={{ cursor: 'pointer' }} onClick={this.props.clickCallback}><u>{this.props.name}</u></a>
                </div>

                <div class="col-lg-3">
                    <Button>Edit</Button>
                </div>

                <div class="col-lg-3">
                    <Button onClick={() => this.setState({areyousure: true})}>Delete</Button>
                </div>

                {(this.state.areyousure) ?
                    <Modal show={this.state.areyousure} onHide={() => this.setState({areyousure: false})}>
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to delete {this.props.name}?</Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => this.setState({areyousure: false})} variant="secondary">
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                this.props.deleteCallback(); 
                                this.setState({areyousure: false})
                                }} variant="danger">
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    : null}

            </div>
        )
    }

}

export default KnownLocation