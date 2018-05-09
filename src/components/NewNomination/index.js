/**
* @author Ritesh Kumar <ritkumar2@publicisgroupe.net>
* @author Prashanth Reddy <somreddy@publicisgroupe.net>
* @description A New Nomination component.
* @param { string } state - state of the supervisees which are under the user.
* @returns { element } - A div container which submits new Nominations
*/

import React, {Component, Fragment} from 'react';
import {Redirect} from 'react-router-dom';
import firebase from '../../config/firebase.js';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import errorMsgs from '../../../public/error-messages.json';
import label from '../../../public/label.json';
import AppConfig from '../../../public/app-config.json';
import MaterialIcon from 'react-google-material-icons';
//styles
import './style.css';
import '../../styles/theme.css';
//components
import Header from '../Header/';
import Footer from '../Footer/';
import Option from '../Option/';
import Loader from '../Loader/';
import * as emailjs from 'emailjs-com';

@inject('Store')
@observer
export default class NewNomination extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            loading: true,
            redirect: false
        });
        this.newNominationSubmit = this
            .newNominationSubmit
            .bind(this);
        this.selectHandler = this.selectHandler.bind(this);
        this.fileHandler = this.fileHandler.bind(this);
    }

    /**
    * @description on authentication fetch user details.
    *               if user is recruiter fetch the details of all supervisees.
    *               if not recruiter fetch the details of supervisees under him/her only
    * 
    */
    componentWillMount() {
        const {Store} = this.props;
        Store.changeHeader(false, true);
        this.firebaseAuth = firebase
            .auth()
            .onAuthStateChanged((user) => {
                if (user) {
                    const uid = user.uid;
                    const ref = firebase.database().ref('users/' + uid);
                    ref.once('value', (snapshot) => {
                        Store.getUserData(snapshot.val());
                    }).then(() => {
                        const userInfo = Store.userDetail,
                            supervisorId = userInfo.OracleID;

                        if (userInfo.isRecruiter) {
                            firebase
                                .database()
                                .ref('users/')
                                .on('value', (snapshot) => {
                                    const superviseesObj = snapshot.val(),
                                        superviseesInfo = Object.keys(superviseesObj).map(e => superviseesObj[e]);
                                    let i = superviseesInfo.findIndex(x => x.OracleID === supervisorId);
                                    if (i >= 0) {
                                        superviseesInfo.splice(i, 1);
                                    }
                                    Store.superviseesList(superviseesInfo);
                                    Store.supervisorId(supervisorId);
                                    this.setState({ loading: false });
                                });
                        } else {
                            firebase
                                .database()
                                .ref('users/')
                                .orderByChild('supervisorId')
                                .equalTo(supervisorId)
                                .on('value', (snapshot) => {
                                    const superviseesObj = snapshot.val();
                                    if (superviseesObj) {
                                        const superviseesInfo = Object.keys(superviseesObj).map(e => superviseesObj[e]);
                                        Store.superviseesList(superviseesInfo);
                                        Store.supervisorId(supervisorId);
                                    }
                                    this.setState({ loading: false });
                                   
                                });
                        }
                    });
                } else {
                    firebase.auth().signOut();
                    Store.authState(false);
                    localStorage.removeItem('user');
                    localStorage.removeItem('statusArray');
                }
            });   
    }
    componentWillUnmount() {
        this.firebaseAuth();
        this.props.Store.duplicateNomination(errorMsgs.reset);
    }

    /**
    * @description throws message based on  whether the file is selected or not
    */
    fileHandler() {
        const uploadedFile = document.querySelector('#attach-file').files[0],
            validFileFormats = AppConfig.validUploadFormat;
        document.querySelector('#uploadFile').value = uploadedFile.name;
        if (!uploadedFile) {
            this.setState({
                uploaderr: errorMsgs.uploadFile 
            });
        }
        else if (validFileFormats.indexOf(uploadedFile.name.split('.').pop()) < 0) {
            this.setState({
                uploaderr: errorMsgs.formateFile 
            });
        }
        else {
            this.setState({
                uploaderr: errorMsgs.reset 
            });
        }
    }
    /**
    * @description throws message based on  whether the person is already nominated or not
    */

    selectHandler(e) {
        const {Store} = this.props;
        const nominationsRef = firebase.database().ref('nominations/');
        const selectedSupervisee = parseInt(e.target.value);
        nominationsRef.orderByChild('OracleID').equalTo(selectedSupervisee).once('value', (snapshot) => {
            const value= snapshot.val();
            if (value) {
                Store.duplicateNomination(errorMsgs.nominated);  
            }
            else {
                Store.duplicateNomination(errorMsgs.reset);
            }
        });
    }
    /**
    * @description submit handler for select nominee.
    *           create a nominations node if not exist and push the selected nominee details.
    *           Also send email to the person if he/she nominated
    */

    newNominationSubmit(e) {
        e.preventDefault();
        const {Store} = this.props, 
            { newNomination, userDetail } = Store,
            nominationsRef = firebase.database().ref('nominations/'),
            selectedSupervisee = parseInt(document.querySelector('select').value),
            uploadedFile = document.querySelector('#attach-file').files[0],
            storageRef = firebase.storage().ref('uploadedFiles/'+selectedSupervisee),
            validFileFormats = AppConfig.validUploadFormat;

        nominationsRef.orderByChild('OracleID').equalTo(selectedSupervisee).once('value', (snapshot) => {
            const value= snapshot.val();
            if (value) {
                Store.duplicateNomination(errorMsgs.nominated);
            }
            else if (!uploadedFile) {
                this.setState({
                    uploaderr: errorMsgs.uploadFile 
                });
            }
            else if (validFileFormats.indexOf(uploadedFile.name.split('.').pop()) < 0) {
                this.setState({
                    uploaderr: errorMsgs.formateFile 
                });
            }
            else {
                this.setState({
                    uploaderr: errorMsgs.reset 
                });
                Store.duplicateNomination(errorMsgs.reset);
                const supervisees = newNomination.supervisees;
                const index = supervisees.findIndex(x => x.OracleID === selectedSupervisee );
                const superviseeInfo = selectedSupervisee === userDetail.OracleID ? userDetail : supervisees[index];
                const uploadTask = storageRef.put(uploadedFile);
                uploadTask.on('state_changed', (snapshot) => {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById('my-bar').style.width = progress + '%';
                }, 
                (error) => {
                    this.setState({
                        uploaderr: error.code 
                    });
                }, 
                //sucess
                () => {
                    const downloadURL = uploadTask.snapshot.downloadURL;
                    nominationsRef.push({
                        name: superviseeInfo.name,
                        status: 'pending',
                        OracleID: superviseeInfo.OracleID, 
                        email: superviseeInfo.email,
                        designation: superviseeInfo.designation,
                        supervisorId: superviseeInfo.supervisorId,
                        nominatedBy: userDetail.OracleID,
                        uploadedFileURL: downloadURL
                    }).then(() => {
                        this.setState({
                            loading: false, 
                            redirect: true  
                        });
    
                        //emailjs
                        emailjs.init('user_G9DuBOofqoI2CscSSqjK5');
                        AppConfig.mailingList.map((email) => {
                            const template_params = {
                                team: email,
                                nominator: userDetail.email,
                                name: superviseeInfo.name,
                                supervisor: userDetail.name
                            };	
                            emailjs.send('team_hpcm', 'new_nominee', template_params, 'user_G9DuBOofqoI2CscSSqjK5');
                        });
                        Store.duplicateNomination(errorMsgs.reset);
                    });          
                });
            }
        });
        
    }

    render() {
        const {state} = this;
        const {Store} = this.props, { userDetail, newNomination} = Store, {name} = userDetail;
        const loaderWrapper = state.loading ?  'loader-wrapper': '';
        const loader = state.loading ?  'loader': '';
        if (state.redirect) {
            return (<Redirect to='/nomineelist'/>);
        }
        document.title = name || label.appTitle;
        return (
            <Fragment>
                <Loader loaderWrapper={loaderWrapper} loader= {loader}/>
                <Header
                    title={label.appTitle}
                    username={name}
                    profileInfo={label.profileLabel}/>
                    
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-12 col-sm-10 col-md-10 col-lg-10 ml-1'>
                            <div className='header-margin'>
                                <h4 className='py-2'>{label.newNominationHeading}</h4>
                                <p className='p-0 details'>
                                    {label.newNominationDetails}
                                </p>
                            </div>
                            <form id='newNomination' onSubmit={this.newNominationSubmit}>
                                <div className='d-flex m-0 my-md-3'>
                                    <h5 className='pr-3 mt-1'>{label.name} :
                                    </h5>
                                    <span>
                                        <select className='selectpicker' onChange={this.selectHandler}>
                                            <Option 
                                                child= "Self" 
                                                value={userDetail.OracleID.toString()}
                                                key={userDetail.OracleID}
                                            />
                                            {newNomination.supervisees.map(data =>
                                                <Option 
                                                    child={data.name +' ( '+ data.OracleID +' )' } 
                                                    value={data.OracleID.toString()}
                                                    key={data.OracleID}
                                                />
                                            )}
                                        </select>
                                    </span>

                                </div>
                                <div>
                                    <div className="errorMsg"> { newNomination.errorMsg } </div>
                                </div>
                                <div className='col-9 col-sm-5 col-md-4 col-lg-3 my-2 p-0'>
                                    <div className='d-flex mx-0 mt-4 p-0'>
                                        <label className='p-0 d-flex my-auto attach-label' htmlFor='attach-file'>
                                            <span className='attach-icon'>
                                                <MaterialIcon icon='attach_file' size={30} />
                                            </span>
                                            <input id='attach-file' type='file' onChange={this.fileHandler} hidden />
                                            <span className='my-auto attach'>
                                                <h6 className="header-title mb-0">{label.attachFile}</h6>
                                            </span>
                                        </label>
                                        <input id="uploadFile" className="upload-file" placeholder="No File" disabled="disabled" />  
                                    </div>
                                    <div id="my-progress">
                                        <div id="my-bar"></div>
                                    </div>
                                    <div className="fileErrorMsg file-upload-error">{state.uploaderr}</div>
                                    <button type='submit' 
                                        className='submit-button button-color bgrow'>
                                        {label.nomineeBtn}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer footerText="&copy; Copyright 2018 HPCM"/>
            </Fragment>
        );
    }

}
NewNomination.propTypes = {
    Store: PropTypes.object
};
