import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import "./LandingPage.css";

class LandingPage extends Component {

    render() {
        return (

            <div>

                <h1 style={{ textAlign: 'center' }}> Location History Viewer</h1>



                <div style={{margin: "0 auto", width: "340px"}}>

                    <section className="stage">
                        <figure className="ball"><span className="globeshadow"></span></figure>
                    </section>

                    <div style={{ height: 100 }}> </div>

                    <div>
                        <a href="/home" class="cta">
                            <span>Try me</span>
                            <svg width="13px" height="10px" viewBox="0 0 13 10">
                                <path d="M1,5 L11,5"></path>
                                <polyline points="8 1 12 5 8 9"></polyline>
                            </svg>
                        </a>
                    </div>

                    <div style={{ height: 100 }}> </div>

                    <div>
                        <a href="#" class="cta">
                            <span>Log In</span>
                            <svg width="13px" height="10px" viewBox="0 0 13 10">
                                <path d="M1,5 L11,5"></path>
                                <polyline points="8 1 12 5 8 9"></polyline>
                            </svg>
                        </a>
                    </div>

                    <div style={{ height: 100 }}> </div>

                    <div>
                        <a href="#" class="cta">
                            <span>Sign Up</span>
                            <svg width="13px" height="10px" viewBox="0 0 13 10">
                                <path d="M1,5 L11,5"></path>
                                <polyline points="8 1 12 5 8 9"></polyline>
                            </svg>
                        </a>
                    </div>

                </div>


            </div>
        )
    }
}

export default withRouter(LandingPage)