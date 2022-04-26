
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import React, { Component } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import LocationService from '../api/LocationService';
import '../App.css';

class LogInPage extends Component {



    constructor() {
        super()

        this.state = {validated: false}

        this.handleButton = this.handleButton.bind(this)
    }

    handleButton(event) {
        const form = event.currentTarget;
        
        //Prevents adding '?' to url as per https://stackoverflow.com/questions/30491742/why-does-a-react-onclick-event-append-a-question-mark-to-my-url
        event.preventDefault();

        // if (form.checkValidity() === false) {
        //     event.preventDefault();
        //     event.stopPropagation();
        // }

        this.setState({validated: true})

        LocationService.authenticate(this.state.username, this.state.password).then((res) => {
            axios.interceptors.request.use(
                (config) => {
                    config.headers.authorization = "Bearer " + res.data.jwt
                    return config
                }
            )
            document.cookie = "jwt=" + res.data.jwt
            console.log(document.cookie)
            this.props.history.push("/home")
        }).catch(() => {
            console.log("Bad")
        })
    }

    render() {
        return (
            <div style={{ margin: 10 }}>

                <h1 style={{ margin: 10 }}>Welcome to this app</h1>

                <Form noValidate validated={this.state.validated} onSubmit={this.handleButton}>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" 
                        //controlId="validationCustomUsername" 
                        onChange={(e) => this.setState({username: e.target.value})}>
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
                        <Form.Group as={Col} md="6" controlId="validationCustom03" onChange={(e) => this.setState({password: e.target.value})}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" required />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid password.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Button type="submit">Login</Button>
                </Form>

            </div>
        )
    }
}

export default withRouter(LogInPage)