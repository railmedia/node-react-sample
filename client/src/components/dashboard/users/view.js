import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { getUsers } from '../../../actions/usersActions';

import Notification from '../../../utils/notification';

class DashboardUsersView extends Component {

    constructor() {
        super();
        this.state = {
            deleteSuccess: false
        }

    }

    deleteUser(id) {

        if( !id ) return false;

        if( window.confirm('Are you sure?') === true ) {

            axios
                .post('/api/users/delete/' + id)
                .then(res => {
                    //console.log(res);
                    this.setState({
                        deleteSuccess: true
                    });
                    this.props.getUsers();
                })
                .catch(err => {
                    //this.setState({errors: err.response.data})
                });

        }

    }

    render() {

        const { users } = this.props;

        return(
            <main>
                <div className="row" style={{ marginTop: '15px' }}>
                    <div className="col s12">
                        <a href="/dashboard/users/add" className="waves-effect waves-light btn blue"><i className="material-icons left">group_add</i>Add New User</a>
                    </div>
                </div>

                { this.state.deleteSuccess === true && (
                    <Notification type="success" hide="5" title="User successfully deleted!" />
                ) }

                <div className="row" style={{ marginTop: '3px' }}>
                    <div className="col s12">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>E-mail</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            { users.fetching === true && (
                                <tr><td colSpan="4"><div className="progress"><div className="indeterminate"></div></div></td></tr>
                            ) }
                            { users.users.map(function(user, i){
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <a title={ `Edit user ${user.name}` } href={ `/dashboard/users/edit/${user._id}` }>
                                                <i style={ { fontSize: '20px' } } className="material-icons">edit</i>
                                            </a>
                                            <a onClick={() => this.deleteUser(user._id) } title={ `Delete user ${user.name}` } style={{cursor:'pointer'}}>
                                                <i style={ { fontSize: '20px', color: '#ee6e73' } } className="material-icons">delete</i>
                                            </a>
                                        </td>
                                    </tr>
                                );
                            }, this) }
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        );
    }

}

DashboardUsersView.propTypes = {
    users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    users: state.users
});

export default connect(
    mapStateToProps,
    { getUsers }
)(DashboardUsersView);
 
