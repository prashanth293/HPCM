/**
 * @author Ritesh Kumar <ritkumar2@publicisgroupie.net>
 * @author Archana Kumari < arckumar2@publicisgroupie.net >
 * @author Amit Raushan < amiraush@publicis@groupe.net >
 * @description A Dashboard component
 * @returns {element}- A Dashboard component including header component
 *         and card component out of which one card is active and three
 *         other are disabled.
 */

import React, {Component} from 'react';
import { Link} from 'react-router-dom';
import firebase from '../../config/firebase';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import '../../styles/global.css';
import '../../styles/theme.css';
import './style.css';
//components
import Card from '../card/';
import Header from '../Header/';
import Footer from '../Footer/';
import label from '../../../public/label.json';
import Loader from '../Loader/';

@inject('Store')
@observer
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }
    /**
    * @description Listening for auth state changes
    * @returns  - fetch  the auhtenticated user data
    */
    componentWillMount() {
        const { Store } = this.props;
        Store.changeHeader(false, true);
        firebase
            .auth()
            .onAuthStateChanged((user) => {
                if (user) {
                    const uid = user.uid;
                    const ref = firebase.database().ref('users/' + uid);
                    ref.once('value', (snapshot) => {
                        Store.getUserData(snapshot.val());
                        this.setState({ loading: false });
                    });
                } else {
                    firebase.auth().signOut();
                    Store.authState(false);
                    localStorage.removeItem('user');
                    localStorage.removeItem('statusArray');
                }
            });
    }
    render() {
        const {state, props} = this,
            { userDetail} = props.Store,
            { name } = userDetail;
        localStorage.setItem('userName', name);
        const loaderWrapper = state.loading ?  'loader-wrapper': '';
        const loader = state.loading ?  'loader': '';
      
        document.title = name || label.appTitle;
        return (
            <div>  
                <div>
                    <Loader loaderWrapper={loaderWrapper} loader={loader} />
                    <Header title={label.appTitle} username={name} profileInfo={label.profileLabel}/>
                    
                </div>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-12 col-md-6 offset-md-2 header-margin header-text-color'>
                            <h4>{label.dasbAppLabel}</h4>
                        </div>
                    </div>
                    <div className='row row-margin pb-4'>
                        <div className='col-12 col-md-4 offset-md-2 row-margin'>
                            <Link to='/nomineelist'><Card className="hover-effect"
                                content={label.panelCardContent}
                                title={label.panelHead}/>
                            </Link>
                        </div>
                        <div className='col-12 col-md-4 row-margin'>
                            <Card
                                className='disabled'
                                content={label.calenderCardContent}
                                enabled='false'
                                title={label.calenderCardTitle}/>
                        </div>
                        <div className='col-12 col-md-4 offset-md-2 row-margin'>
                            <Card
                                className='disabled'
                                content={label.hiringCardContent}
                                enabled='false'
                                title={label.hiringCardTitle}/>
                        </div>
                        <div className='col-12 col-md-4 row-margin'>
                            <Card
                                className='disabled'
                                content={label.reportingCardContent}
                                enabled='false'
                                title={label.reportingCardTitle}/>
                        </div>
                    </div>
                </div>
                <Footer footerText="&copy; Copyright 2018 HPCM"/>
            </div>
        );
    }
}
Dashboard.propTypes = {
    authenticated: PropTypes.bool,
    Store: PropTypes.object,
    heading: PropTypes.string
};
export default Dashboard;
