
import 'leaflet/dist/leaflet.css';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import LocationService from '../api/LocationService.js';
import '../App.css';
import Countries from './Countries.jsx';
import DateTimeTab from './DateTimeTab.jsx';
import Day from './Day.jsx';
import Heatmap from './Heatmap.jsx';
import KnownLocations from './KnownLocations.jsx';
import Lifetime from './Lifetime.jsx';
import Settings from './Settings.jsx';
import TopBar from './TopBar.jsx';

class Prototype extends Component {

    constructor() {
        super()
        LocationService.test()
    }

    render() {

        return (
            <div>

                <TopBar></TopBar>

                <Tabs style={{ margin: 15 }}>

                    <TabList>
                        <Tab>Date</Tab>
                        <Tab>Known Locations</Tab>
                        <Tab>Day</Tab>
                        <Tab>Lifetime</Tab>
                        <Tab>Vacations</Tab>
                        <Tab>Heatmap</Tab>
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
                        <Heatmap></Heatmap>
                    </TabPanel>
                    <TabPanel>
                        <Settings></Settings>
                    </TabPanel>
                </Tabs>

            </div >
        )
    }

}

export default withRouter(Prototype)