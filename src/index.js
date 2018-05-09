
/**
* @author Saumya Shree <saushree@publicisgroupe.net>
* @author Amit Raushan <amiraush@publicisgroupe.net>
* @description An App component.
* @param -  No parameters.
* @returns { element } - A Fragment that contains Login component which is login page of the application
*/
import React, { Component } from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {browserHistory} from 'react-router';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import {inject, observer} from 'mobx-react';
import firebase from './config/firebase';
import {Provider} from 'mobx-react';
import Store from './stores/';
//components
import Dashboard from './components/Dashboard/';
import Login from './components/Login/';
import Logout from './components/Logout/';
import NotFound from './components/NotFound/';
import NomineeList from './components/NomineeList/';
import NewNomination from './components/NewNomination/';
import AboutUs from './components/AboutUs/';
import Help from './components/Help/';
import ResetPswd from './components/ResetPswd/';
import './assets/images/favicons/favicons';

const PublicRoute = ({component: Component, authed, ...rest}) => {
    return (
        <Route
            {...rest}
            render={(props) => authed === false
                ? <Component {...props} />
                : <Redirect to={{pathname: '/dashboard' }}/>}
        />
    );
};
const PrivateRoute = ({component: Component, authed, ...rest}) => {
    return (
        <Route
            {...rest}
            render={(props) => authed === true
                ? <Component {...props} />
                : <Redirect to={{pathname: '/'}} />}
        />
    );
};
@inject('Store')
@observer
class App extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount () {
        const { Store} =this.props;
        localStorage.getItem('user') ? Store.authState(true) : Store.authState(false);
        
        firebase
            .auth()
            .onAuthStateChanged((user) => {
                if (user) {
                    localStorage.setItem('user', user.providerData[0]);
                    Store.authState(true);

                } else {
                    Store.authState(false);
                    localStorage.removeItem('user');
                }
            });
    }

    render() {
        const {authenticated} = this.props.Store.loginState;
        return (
            <BrowserRouter history={browserHistory}>
                <Switch> 
                    <PublicRoute exact path='/' component={Login} authed={authenticated} />
                    <PrivateRoute exact authed={authenticated} path='/dashboard' component={Dashboard}/>
                    <PrivateRoute exact path='/logout' component={Logout} authed={authenticated}/>
                    <PrivateRoute exact authed={authenticated} path='/nomineelist' component={NomineeList}/>
                    <PrivateRoute exact authed={authenticated} path='/newnomination' component={NewNomination}/>
                    <PrivateRoute exact authed={authenticated} path='/aboutus' component={AboutUs}/>
                    <PrivateRoute exact authed={authenticated} path='/help' component={Help}/>
                    <Route exact path='/resetpassword' component={ResetPswd} />
                    <Route path='*' component={NotFound}/>
                </Switch>
            </BrowserRouter >   
        );
    }
}
PrivateRoute.propTypes = {
    authed: PropTypes.bool,
    location: PropTypes
        .shape( {pathname: PropTypes.string.isRequired}),
    
    component: PropTypes.func
};
PublicRoute.propTypes = {
    authed: PropTypes.bool,
    location: PropTypes
        .shape( {pathname: PropTypes.string.isRequired}),
    
    component: PropTypes.func
};
App.propTypes = {
    Store: PropTypes.object
};

render( 
    <Provider Store={Store}>
        <App/>
    </Provider>, document.getElementById('reactContainer'));

