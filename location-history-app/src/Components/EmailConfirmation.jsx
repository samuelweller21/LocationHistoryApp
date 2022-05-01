import bcrypt from "bcryptjs";
import React, { Component } from 'react';
import { Button, Form, InputGroup, Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import LocationService from '../api/LocationService';

class EmailConfirmation extends Component {

    constructor(props) {
        super();

        document.title = "Location History Viewer - Email Confirmation"

        this.state = {
            validated: false,
            username: "",
            message: "",
            code: props.match.params.code
        }
    }

    componentDidMount() {
        LocationService.createUserGetUsername(this.state.code).then((res) => this.setState({username: res.data}))
    }

    handleClick() {
        if (this.state.password !== this.state.password2) {
            this.setState({message: "Passwords do not match"})
            return
        }

        let salt = "$2a$10$nmzjN21Ti0f7w8hcrgcms."
        let encrp = bcrypt.hashSync(this.state.password, salt)
        let encrp2 = bcrypt.hashSync(this.state.password, salt)
        console.log(encrp)
        console.log(encrp2)
        LocationService.createUser(this.state.username, encrp, this.state.code).then(res => {
            LocationService.authenticate(this.state.username, encrp)
        }).catch(err => {
            console.log(err)
            this.setState({message: "Sorry that didn't work"})
        })
    }


    render() {

        if (this.state.username == "") {
            return (<div></div>)
        } else {

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
                                    <Form.Label>Your email</Form.Label>
                                    <InputGroup
                                    // hasValidation
                                    >
                                        <Form.Control
                                            //type="email"
                                            placeholder={this.state.username}
                                            aria-describedby="inputGroupPrepend"
                                            disabled
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

                            <Row className="mb-3">
                                <Form.Group controlId="validationCustom03" onChange={(e) => this.setState({ password2: e.target.value })}>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" required />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid password.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Button onClick={() => this.handleClick()} style={{ width: "30%" }}>Sign Up</Button>
                            </div>

                            <div style={{ display: "flex", justifyContent: "center" }}>
                                {this.state.message}
                            </div>
                        </Form>

                    </div>

                </div>
            )
        }
    }

}

export default withRouter(EmailConfirmation)
