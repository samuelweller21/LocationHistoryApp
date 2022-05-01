
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

        document.title = "Location History Viewer - Home"

        LocationService.test()
    }

    render() {

        return (
            <div>

                <TopBar></TopBar>

                <Tabs style={{ margin: 15 }}>

                    <TabList>
                        <Tab style={{background: "rgba(0,0,0,0)"}}>Date</Tab>
                        <Tab style={{background: "rgba(0,0,0,0)"}}>Known Locations</Tab>
                        <Tab style={{background: "rgba(0,0,0,0)"}}>Day</Tab>
                        <Tab style={{background: "rgba(0,0,0,0)"}}>Lifetime</Tab>
                        <Tab style={{background: "rgba(0,0,0,0)"}}>Vacations</Tab>
                        <Tab style={{background: "rgba(0,0,0,0)"}}>Heatmap</Tab>
                        <Tab style={{background: "rgba(0,0,0,0)"}}>Settings</Tab>
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