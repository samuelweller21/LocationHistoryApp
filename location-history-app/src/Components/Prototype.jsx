
import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import DateTimeTab from './DateTimeTab.jsx'
import Day from './Day.jsx'
import KnownLocations from './KnownLocations.jsx'
import 'leaflet/dist/leaflet.css'
import '../App.css'
import Lifetime from './Lifetime.jsx'
import Countries from './Countries.jsx'
import Settings from './Settings.jsx'

class Prototype extends Component {

    constructor() {
        super()
    }

    render() {
        return (
            <div>

                <h1 style={{margin: 10}}>Welcome to this app</h1>

                <Tabs style={{margin: 15}}>

                    <TabList>
                        <Tab>Date</Tab>
                        <Tab>Known Locations</Tab>
                        <Tab>Day</Tab>
                        <Tab>Lifetime</Tab>
                        <Tab>Vacations</Tab>
                        <Tab>Settings</Tab>
                    </TabList>

                    <TabPanel>
                        <DateTimeTab></DateTimeTab>
                    </TabPanel>
                    <TabPanel>
                        <KnownLocations></KnownLocations>
                    </TabPanel>
                    <TabPanel>
                        <Day></Day>
                    </TabPanel>
                    <TabPanel>
                        <Lifetime></Lifetime>
                    </TabPanel>
                    <TabPanel>
                        <Countries></Countries>
                    </TabPanel>
                    <TabPanel>
                        <Settings></Settings>
                    </TabPanel>
                </Tabs>
            </div>
        )
    }

}

export default Prototype