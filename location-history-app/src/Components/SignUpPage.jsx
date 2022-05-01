
import 'leaflet/dist/leaflet.css';
import React, { Component } from 'react';
import { Button, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import LocationService from '../api/LocationService';
import '../App.css';

class SignUpPage extends Component {

    constructor() {
        super()

        document.title = "Location History Viewer - Signup"

        this.state = { 
            validated: false,
            message: "",
            accountExists: false
         }

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

        this.setState({ validated: true })

        console.log("Email: " + this.state.username)

        LocationService.createUserGetJWT(this.state.username).then(res => {
            this.setState({message: "Please check your emails (including junk)", accountExists: false})
        }).catch(err => {
            if (err.toJSON().status == 400) {
                this.setState({message: "", accountExists: true})
            } else {
                this.setState({message: "", accountExists: false})
            }
        })
    }

    render() {
        return (
            <div>

                <div style={{ justifyContent: "center", display: "flex" }}>
                    <section className="stage2">
                        <figure className="ball"></figure>
                    </section>
                    <h1 style={{ lineHeight: "50px" }}>Location History Viewer</h1>
                </div>

                <div style={{justifyContent: "center", display: "flex"}}>
                    <Form style={{display: "flex", width: "30%", flexDirection: "column", justifyContent: "center" }} noValidate validated={this.state.validated} onSubmit={this.handleButton}>
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
                                        placeholder="example@hotmail.com"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter an email.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                        
                        
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Button style={{width: "40%"}} type="submit">Send confirmation email</Button>
                        </div>
                    </Form>

                </div>

                <div style={{display: "flex", justifyContent: "center"}}>
                    {this.state.message}
                </div>

                {this.state.accountExists ? 
                <div style={{display: "flex", justifyContent: "center"}}>
                    <p style={{whiteSpace: "pre"}}>You already have an account, please </p> <Link style={{color: "#008CBA"}} to="/login"> login </Link> <p style={{whiteSpace: "pre"}}> instead</p>
                </div>
                : "" }

            </div>
        )
    }
}

export default withRouter(SignUpPage)