
import 'leaflet/dist/leaflet.css';
import React, { Component } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import 'react-tabs/style/react-tabs.css';

class KnownLocation extends Component {

    constructor(props) {
        super()
        this.state = { areyousure: false }
    }

    render() {
        return (
            <Row md={10} style={{margin: 5}}>

                <Col md={6}>
                    <button className="link" onClick={this.props.clickCallback}><u>{this.props.name}</u></button>
                </Col>

                <Col md={3}>
                    <Button onClick={() => this.props.editCallback()}>Edit</Button>
                </Col>

                <Col md={3}>
                    <Button onClick={() => this.setState({areyousure: true})}>Delete</Button>
                </Col>

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

            </Row>
        )
    }

}

export default KnownLocation