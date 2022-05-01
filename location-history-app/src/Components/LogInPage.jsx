
import bcrypt from "bcryptjs";
import 'leaflet/dist/leaflet.css';
import React, { Component } from 'react';
import { Button, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import LocationService from '../api/LocationService';
import '../App.css';

class LogInPage extends Component {



    constructor(props) {
        super()

        document.title = "Location History Viewer - Login"

        let message = ""
        if (typeof props.match.params.error !== "undefined") {
            message = props.match.params.error
        }

        this.state = {
            validated: false,
            message: message,
            changePW: false,
            NoChangePW: false
        }

        this.handleButton = this.handleButton.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.error !== this.props.match.params.error) {
            if (typeof this.props.match.params.error !== "undefined") {
                this.setState({ message: "" })
            } else {
                this.setState({ message: this.props.match.params.error })
            }
        }
    }

    handleButton(event) {
        const form = event.currentTarget;

        //Prevents adding '?' to url as per https://stackoverflow.com/questions/30491742/why-does-a-react-onclick-event-append-a-question-mark-to-my-url
        event.preventDefault();

        // if (form.checkValidity() === false) {
        //     event.preventDefault();
        //     event.stopPropagation();
        // }

        this.setState({ validated: true })

        let salt = "$2a$10$nmzjN21Ti0f7w8hcrgcms."
        let encrp = bcrypt.hashSync(this.state.password, salt)

        LocationService.authenticate(this.state.username, encrp)
    }

    forgotPassword() {
        LocationService.resetPassword(this.state.username).then(res => {
            this.setState({ changePW: true, NoChangePW: false })
        }).catch(err => {
            this.setState({ NoChangePW: true, changePW: false })
        })
    }

    render() {
        console.log(this.state)
        return (
            <div>

                <div style={{ justifyContent: "center", display: "flex" }}>
                    <section className="stage2">
                        <figure className="ball"></figure>
                    </section>
                    <h1 style={{ lineHeight: "50px" }}>Location History Viewer</h1>
                </div>

                <div style={{ justifyContent: "center", display: "flex" }}>
                    <Form style={{ display: "flex", width: "30%", flexDirection: "column", justifyContent: "center" }} noValidate validated={this.state.validated} onSubmit={this.handleButton}>
                        <Row className="mb-3">
                            <Form.Group
                                //controlId="validationCustomUsername" 
                                onChange={(e) => this.setState({ username: e.target.value })}>
                                <Form.Label>Email</Form.Label>
                                <InputGroup
                                // hasValidation
                                >
                                    <Form.Control
                                        //type="email"
                                        placeholder="Username"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter an email.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group controlId="validationCustom03" onChange={(e) => this.setState({ password: e.target.value })}>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" required />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid password.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
                            <Button style={{ width: "30%" }} onClick={() => this.forgotPassword()}>Forgot Password</Button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Button style={{ width: "30%" }} type="submit">Login</Button>
                        </div>
                    </Form>

                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                    {this.state.message}
                </div>

                    <Modal show={this.state.changePW}>
                            <Modal.Header>
                                <Modal.Title>Password Change Request</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <p>Check your emails (including junk)</p>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="primary" onClick={() => { this.setState({ changePW: false, NoChangePW: false }) }}>Okay</Button>
                            </Modal.Footer>
                             </Modal>

                <Modal show={this.state.NoChangePW}>
                        <Modal.Header>
                            <Modal.Title>Password Change Request</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>You do not have an account</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="primary" onClick={() => { this.setState({ NoChangePW: false, changePW: false }) }}>Okay</Button>
                        </Modal.Footer>
                </Modal>
                

            </div>
        )
    }
}

export default withRouter(LogInPage)