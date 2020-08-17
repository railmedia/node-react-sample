import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';

import { Provider } from 'react-redux';
import store from './store';
import './App.css';

import AppRoutes from './components/routes/router.js';

if( localStorage.jwtToken ) {

    const token = localStorage.jwtToken;
    setAuthToken(token);
    const decoded = jwt_decode(token);
    store.dispatch(setCurrentUser(decoded));

    const currentTime = Date.now() / 1000;
    if( decoded.exp < currentTime ) {
        store.dispatch(logoutUser());
    }

    //window.location.href = './login';

}

class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <AppRoutes />
                    </div>
                </Router>
            </Provider>
        );
    }

}

export default App;
 
