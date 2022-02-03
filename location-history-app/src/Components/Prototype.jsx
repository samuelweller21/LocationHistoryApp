
import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import DateTimeTab from './DateTimeTab.jsx'

import "./map.css"

class Prototype extends Component {

    constructor() {
        super()
    }

    render() {
        return (
            <div>

                <h1>Welcome to this app</h1>

                <Tabs>

                    <TabList>
                        <Tab>Date & Time</Tab>
                        <Tab>Known Locations</Tab>
                    </TabList>

                    <TabPanel>
                        <DateTimeTab></DateTimeTab>
                    </TabPanel>
                    <TabPanel>
                        <h2>Known Locations</h2>
                    </TabPanel>

                    
                </Tabs>
            </div>
        )
    }

}

export default Prototype