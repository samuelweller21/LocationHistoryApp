
import { createBrowserHistory } from 'history';
import 'leaflet/dist/leaflet.css';
import React, { Component } from 'react';
import { Button, Modal, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import 'react-tabs/style/react-tabs.css';
import LocationService from '../api/LocationService';
import '../App.css';

class TopBar extends Component {

    constructor() {
        super()

        this.state = {
            username: "",
            changePW: false
        }
    }

    componentDidMount() {
        LocationService.getUsername().then(res => { this.setState({ username: res.data }) })
    }

    logout() {
        document.cookie = "jwt=" + "" + "; path=/"
        createBrowserHistory().push("/welcome")
        window.location.reload();
    }

    changePassword() {
        LocationService.resetPassword(this.state.username).then(res => {
            this.setState({ changePW: true })
        })
    }

    render() {
        return (
            <div style={{ display: "flex" }}>
                <div style={{ flex: "5%" }}>
                    <section className="stage2">
                        <figure className="ball"></figure>
                    </section>
                </div>
                <div style={{ flex: "95%" }}>
                    <h1 style={{ lineHeight: "50px" }}>Location History Viewer</h1>
                </div>

                <Navbar>
                    <Navbar.Collapse align="end">
                        <Nav>
                            <NavDropdown
                                align="end"
                                title={"Signed in as: " + this.state.username}
                            >
                                <NavDropdown.Item onClick={() => this.changePassword()}>Change Password</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => this.logout()}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Modal show={this.state.changePW}>
                        <Modal.Header>
                            <Modal.Title>Password Change Request</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Check your emails (including junk)</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="primary" onClick={() => { this.setState({ changePW: false }) }}>Okay</Button>
                        </Modal.Footer>
                         </Modal>

            </div>
        )
    }
}

export default TopBar