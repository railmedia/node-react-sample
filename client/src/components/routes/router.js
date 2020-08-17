import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Landing from '../layout/Landing';
//import Register from '../auth/Register';
import Login from '../auth/Login';
import Dashboard from '../dashboard/Dashboard';

class AppRoutes extends Component {

    render() {
        return (
            <div>

                <Route exact path="/" component={Login} />
                {/* <Route path="/register" component={Register} /> */}
                <Route path="/login" component={Login} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/dashboard/users" component={Dashboard} />
                <Route exact path="/dashboard/users/view" component={Dashboard} />
                <Route exact path="/dashboard/users/add" component={Dashboard} />
                <Route exact path="/dashboard/users/edit/:id" component={ Dashboard } />
                <Route exact path="/dashboard/merchants" component={Dashboard} />
                <Route exact path="/dashboard/merchants/view" component={Dashboard} />
                <Route exact path="/dashboard/merchants/add" component={Dashboard} />
                <Route exact path="/dashboard/merchants/edit/:id" component={Dashboard} />
                <Route exact path="/dashboard/sites" component={Dashboard} />
                <Route exact path="/dashboard/sites/view" component={Dashboard} />
                <Route exact path="/dashboard/sites/add" component={Dashboard} />
                <Route exact path="/dashboard/sites/edit/:id" component={ Dashboard } />
                <Route exact path="/dashboard/logs" component={Dashboard} />
                <Route exact path="/dashboard/logs/view" component={Dashboard} />
                <Route exact path="/dashboard/settings" component={Dashboard} />

            </div>
        );
    }

}

//export default AppRoutes;

AppRoutes.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { }
)(AppRoutes);
 
