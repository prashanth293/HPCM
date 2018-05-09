
/**
* @author Amit Raushan <amiraush@publicis@groupe.net>
* @description logout component.
* @returns - logout the user and redirect to login page
*/

import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import firebase from '../../config/firebase.js';
import {inject, observer} from 'mobx-react';
import {PropTypes} from 'prop-types';

@inject('Store')
@observer
class Logout extends Component {
    constructor(props) {
        super(props);
    }
    /**
    * @description signout the user
    */
    componentWillMount() {
        const { Store } = this.props;
        firebase
            .auth()
            .signOut();
        localStorage.removeItem('statusArray');
        localStorage.removeItem('sortingStatus');
        localStorage.removeItem('user');
        localStorage.removeItem('userName');
        Store.authState(false);
        Store.changeHeader(false, true);
        Store.setSortingMethod('');
        Store.clearAllError();
    }
    render() {
        return (
            <Redirect to='/'/>        
        );
    }
}
export default Logout;
Logout.propTypes = {
    Store: PropTypes.object
};