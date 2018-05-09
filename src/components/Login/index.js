/**
* @author Saumya Shree <saushree@publicisgroupe.net>
* @author Amit Raushan <amiraush@publicisgroupe.net>
* @description A Login component.
* @returns { element } - A div conatiner which contains form element 
*/

import React, { Component, Fragment } from 'react';
import './index.css';
import '../../styles/theme.css';
import firebase from '../../config/firebase.js';
import logo from '../../assets/images/hpcm-logo2.png';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import errorMsgs from '../../../public/error-messages.json';
import label from '../../../public/label.json';
import AppConfig from '../../../public/app-config.json';

//components
import Checkbox from '../Checkbox/';
import Input from '../Input/';
import Footer from '../Footer/';
import Forgotpswd from '../Forgotpassword/';
import Modal from '../Modal/';

@inject('Store')
@observer
class Login extends Component  {
    constructor(props) {
        super(props);
        this.forgotPswdModal=this.forgotPswdModal.bind(this);
        this.authWithEmailPassword =this.authWithEmailPassword.bind(this); 
        this.handleCheck = this.handleCheck.bind(this);
        this.closeForgotPswdModal = this.closeForgotPswdModal.bind(this);
    }
    /**
    * @description storing remeberMe state in local storage
    */
    componentWillMount() {
        const { Store } = this.props;
        if (localStorage.getItem( 'remember-me') === 'true') {
            Store.getUserValue(localStorage.getItem('username'));
            Store.rememberMeState(true);
        } else {
            Store.getUserValue('');
        }

    }
   
    /**
    * @description open the forgot password modal
    */
    forgotPswdModal() {
        const { Store } = this.props;
        Store.resetPswd(true);
    }
    /**
    * @description closes the forgot password modal
    */
    closeForgotPswdModal() {
        const { Store } = this.props;
        Store.resetPswd(false);
        Store.forgotPswdRedirect(false);
        Store.clearAllError();
    }

    /**
    * @description on form submit check authentication
    * @param -  event target/the form that is submitted
    * @returns - nothing
    */
    authWithEmailPassword(e) {
        e.preventDefault();

        const { Store } = this.props;
        const form = e.target,
            email = form.username.value,
            password = form.pswd.value;

        const regexEmail = new RegExp(AppConfig.emailRegex);
        const regexPassword = new RegExp(AppConfig.passwordRegex) ;

        Store.loginState.rememberMe
            ? (
                localStorage.setItem( 'username', email),
                localStorage.setItem( 'remember-me', true)
            )
            : localStorage.setItem( 'remember-me', false );
        
        Store.changeinputEditState(false);
        if (!email) {
            form.username.focus();
            Store.setEmailErrorMsg(errorMsgs.emptyEmailField);
        } else if ( !regexEmail.test( String( email ) ) ) {
            form.username.focus();
            Store.setEmailErrorMsg(errorMsgs.invalidEmail);      
        } else if (!password) {
            form.pswd.focus();
            Store.setPswdErrorMsg(errorMsgs.emptyPswdField);
        }  else if ( !regexPassword.test( String( password ) ) ) {
            form.pswd.focus();
            Store.setPswdErrorMsg(errorMsgs.invalidPswd);   
        }
        else {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    this.loginForm.reset();
                    Store.setErrorMsg(errorMsgs.reset);
                })
                .catch(() => {
                    Store.setErrorMsg(errorMsgs.invalidAuth);
                });
        }
    }
  
    /**
    * @description handles remember me checkbox
    * @param -  No parameters.
    */
    handleCheck() {
        const { Store } = this.props;
        Store.rememberMeState(!Store.loginState.rememberMe);
    }
    render() {
        const { loginState } = this.props.Store;
        document.title = label.appTitle;
        return (
            <Fragment>
                <div className = "flex-container-page container-fluid">                    
                    <div className = "flex-container-form">
                        <div className = "desktop-form login-form-wrapper col-xl-3 col-md-5 col-lg-4">
                            <img src = { logo }  id = "logo" alt = {label.appTitle}/>              

                            <form id = "loginForm" 
                                autoComplete = "on" 
                                onSubmit = {this.authWithEmailPassword }
                                noValidate>

                                <div className = "form-group">
                                    <label htmlFor = "username">{label.emailLabel}
                                        <span className = "text-primary">*</span>
                                    </label>

                                    <Input  type = "email" 
                                        name = "email"
                                        id = "username" 
                                        value = { loginState.userValue }
                                        required = { true }
                                        regex = { new RegExp(AppConfig.emailRegex) }
                                        warning={errorMsgs.invalidEmail }
                                        error = { loginState.emailErrorMsg }/>
                                </div>

                                <div className = "form-group">
                                    <label htmlFor = "pswd">{label.pswLabel}
                                        <span className = "text-primary">*</span>
                                    </label>

                                    <Input  type = "password" 
                                        name = "Password" 
                                        id = "pswd" 
                                        value = ''
                                        required = { true }
                                        regex = { new RegExp(AppConfig.passwordRegex) }
                                        warning={ errorMsgs.invalidPswd  }
                                        error = { loginState.pswdErrorMsg }/>
                                </div>

                                <div>
                                    <Checkbox checked = { loginState.rememberMe } 
                                        id = "remember" 
                                        name = "remember"
                                        onChange = { this.handleCheck } />

                                    <label htmlFor = "remember">
                                        {label.remLabel}
                                    </label>

                                    <a
                                        id = "forgotPswd" 
                                        className = "float-right text-right forgotPswd link-color" 
                                        onClick= {this.forgotPswdModal}> 
                                        
                                        {label.forgtLabel}
                                    </a>

                                </div> 
                                
                                <div>
                                    <button type = "submit" 
                                        className = "btn bgrow login-btn button-color">
                                        {label.loginBtn}
                                    </button>
                                </div>
                                <div>
                                    <strong id="errMsg" 
                                        className="form-text text-danger">
                                        {loginState.errorMsg}
                                    </strong>
                                </div>
                                <small 
                                    className="form-text link-color">
                                    {label.reqLabel}
                                </small>

                            </form>
                        </div>
                    </div>
                </div>
                <Footer footerText="&copy; Copyright 2018 HPCM" />
                <Modal display={loginState.showforgotPswdModal}
                    modalHeading='Reset Password' >
                    <Forgotpswd onClick={this.closeForgotPswdModal} />
                </Modal>
            </Fragment>
        );
    }
}

Login.propTypes = {
    Store: PropTypes.object
};
export default Login;

