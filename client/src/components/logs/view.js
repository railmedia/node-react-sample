import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Select from 'react-select';

import Notification from '../../../utils/notification';

function DashboardLogsView(props) {

    const [logs, setLogs] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [deleteSuccess, setDeleteSucces] = useState(false);
    const [filterSite, setFilterSite] = useState();
    const [filterSitesSelect, setFilterSitesSelect] = useState([]);
    const [filterStep, setFilterStep] = useState();
    const [filterYear, setFilterYear] = useState();
    const [filterMonth, setFilterMonth] = useState();
    const [filterDay, setFilterDay] = useState();
    const [filterHour, setFilterHour] = useState();
    const [availableDays, setAvailableDays] = useState([]);
    const [availableHours, setAvailableHours] = useState([]);
    const dispatch = useDispatch();
    const sites = useSelector(state => state.sites);
    const monthsDaysMap = {
        1: 31,
        2: 29,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
    };

    useEffect( () => {
 
        axios
            .post('/api/logs/all/')
            .then(res => {
                setLogs(res.data);
                setFetching(false);
                // this.setState({
                //     logs: res.data,
                //     fetching: false
                // });
                //console.log(res);
            })
            .catch(err => {
                //this.setState({errors: err.response.data})
            });

        if( sites ) {
            let theSites = [];
            for( let i = 0; i < sites.sites.length; i++) {
                theSites.push({ value: sites.sites[i]._id, label: sites.sites[i].name });
            }
            setFilterSitesSelect(theSites);
        }

        if( ! availableHours ) {
            let theHours = []
            for( let i = 0; i <= 24; i++ ) {
                theHours.push( { value: i, label: i } );
            }
            setAvailableHours(  theHours );
        }

    }, [setLogs, sites, setAvailableHours]);

    function deleteLog(id) {

        if( !id ) return false;

        if( window.confirm('Are you sure?') == true ) {

            // axios
            //     .post('/api/sites/delete/' + id)
            //     .then(res => {
            //         this.setState({
            //             deleteSuccess: true
            //         });
            //         this.props.getUsers();
            //     })
            //     .catch(err => {
            //         //this.setState({errors: err.response.data})
            //     });

        }

    }

    async function onSiteFilterChange(site) {

        setFetching(true);

        let updateLogs = await axios
            .post('/api/logs/site/' + site.value)
            .then(res => {
                setLogs(res.data);
                setFetching(false);
            })
            .catch(err => {
                //this.setState({errors: err.response.data})
            });

    }

    async function onFilterStepChange(step) {

    }

    async function onFilterYearChange(year) {

    }

    async function onFilterMonthChange(month) {

        let theMonth = month.value, monthsDays = [];

        for ( let i = 1; i <= monthsDaysMap[theMonth]; i++ ) {
            monthsDays.push( { value: i, label: i } );
        }

        console.log(monthsDaysMap[theMonth], monthsDays);

        setAvailableDays( monthsDays );

    }

    async function onFilterDayChange(day) {

    }

    async function onFilterHourChange(hour) {

    }

    return(
        <main>

            { deleteSuccess === true && (
                <Notification type="success" hide="5" title="Log successfully deleted!" />
            ) }

            <div className="row" style={{ marginTop: '3px' }}>
                <div className="col s12">
                    <h5>Logs</h5>
                </div>
            </div>
            <div className="row" style={{ marginTop: '3px' }}>
                <div className="col s2">
                    <Select
                        id="step"
                        value={ filterStep }
                        onChange={ onFilterStepChange }
                        options={ [
                            { value: 's1_s2', label: 'S1 / S2' },
                            { value: 's3', label: 'S3' },
                            { value: 's4', label: 'S4' },
                            { value: 's5', label: 'S5' }
                        ] }
                        placeholder="Filter by step"
                    />
                </div>
                <div className="col s2">
                    <Select
                        id="site"
                        value={ filterSite }
                        onChange={ onSiteFilterChange }
                        options={ filterSitesSelect }
                        placeholder="Filter by site"
                    />
                </div>
                <div className="col s2">
                    <Select
                        id="year"
                        value={ filterYear }
                        onChange={ onFilterYearChange }
                        options={ [
                            { value: '2019', label: '2019' },
                            { value: '2020', label: '2020' },
                        ] }
                        placeholder="Filter by year"
                    />
                </div>
                <div className="col s2">
                    <Select
                        id="month"
                        value={ filterMonth }
                        onChange={ onFilterMonthChange }
                        options={ [
                            { value: '1', label: 'January' },
                            { value: '2', label: 'February' },
                            { value: '3', label: 'March' },
                            { value: '4', label: 'April' },
                            { value: '5', label: 'May' },
                            { value: '6', label: 'June' },
                            { value: '7', label: 'July' },
                            { value: '8', label: 'August' },
                            { value: '9', label: 'September' },
                            { value: '10', label: 'October' },
                            { value: '11', label: 'November' },
                            { value: '12', label: 'December' }
                        ] }
                        placeholder="Filter by month"
                    />
                </div>
                <div className="col s2">
                    <Select
                        id="day"
                        value={ filterDay }
                        onChange={ onFilterDayChange }
                        options={ availableDays }
                        placeholder="Filter by day"
                    />
                </div>
                <div className="col s2">
                    <Select
                        id="hours"
                        value={ filterHour }
                        onChange={ onFilterHourChange }
                        options={ availableHours }
                        placeholder="Filter by hour"
                    />
                </div>
            </div>

            <div className="row" style={{ marginTop: '3px' }}>
                <div className="col s12">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Site</th>
                                <th>Type</th>
                                <th>Body</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        { fetching === true && (
                            <tr><td colSpan="7"><div className="progress"><div className="indeterminate"></div></div></td></tr>
                        ) }
                        { logs.map(function(log, i){

                            return (
                                <tr key={i}>
                                    <td>{i}</td>
                                    <td>{log.sitename}</td>
                                    <td>
                                        { log.type }
                                        { log.subtype && (
                                            log.subtype
                                        ) }
                                    </td>
                                    <td>{ log.body.substr( 1, 20 )  }</td>
                                    <td>
                                        <a onClick={() => deleteLog(log._id) } title={ `Delete log ${log._id}` } style={{cursor:'pointer'}}>
                                            <i style={ { fontSize: '20px', color: '#ee6e73' } } className="material-icons">delete</i>
                                        </a>
                                    </td>
                                </tr>
                            );
                        }) }
                        </tbody>
                    </table>
                </div>
            </div>

        </main>
    );
}

export default DashboardLogsView; 
