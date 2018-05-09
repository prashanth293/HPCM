/**
* @author Prashanth Reddy <somreddy@publicisgroupe.net>
* @description A Forgot Password component.
* @param { string } state - state of the component : initial form field values (passed down to child via props).
* @returns { element } - A div container which contains form element 
*/
import React, { Component} from 'react';
import './style.css';
import firebase from '../../config/firebase.js';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import MaterialIcon from 'react-google-material-icons';
import label from '../../../public/label.json';
import errorMsgs from '../../../public/error-messages.json';
import AppConfig from '../../../public/app-config.json';
import Input from '../Input/';

@inject('Store')
@observer
class ForgotPassword extends Component  {
    constructor ( props ) {
        super ( props );
        this.resetPassword = this.resetPassword.bind(this);
        this.modalClose = this.modalClose.bind(this);  
    }

    resetPassword ( e ) {
        e.preventDefault();
        const form = e.target,
            email = form.emailId.value,
            { Store } = this.props,
            actionCodeSettings = {
                // URL  to redirect back to.
                url: 'http://localhost:5001',
            },
            regexEmail = new RegExp(AppConfig.emailRegex);
        Store.changeinputEditState(false);
        if (!email) {
            form.emailId.focus();
            Store.forgotPswdErrorMsg(errorMsgs.emptyEmailField);

        } else if ( !regexEmail.test( String( email ) ) ) {
            form.emailId.focus();
            Store.forgotPswdErrorMsg(errorMsgs.invalidEmail);    
        } else {
            Store.forgotPswdErrorMsg(errorMsgs.reset); 
            firebase.auth().sendPasswordResetEmail(email, actionCodeSettings).then(() => {
                localStorage.setItem('username', email);
                this.forgotPasswordForm.reset();
                Store.forgotPswdRedirect(true);
                Store.forgotPswdSuccess(errorMsgs.forgotPswdSuccess);
            }).catch(() => {
                Store.forgotPswdErrorMsg(errorMsgs.resetPswdError);

            });
                    
        }
    }
    modalClose() {
        this.props.onClick();
    }
    render() {
        const {forgotPswd} = this.props.Store;
        return (
            forgotPswd.redirect
                ? (
                    <div className="mx-3 text-center">
                        <div>{forgotPswd.msg}</div>
                        <strong>{localStorage.getItem('username')}</strong>
                        <div className="d-flex flex-row justify-content-around mt-4 mb-0">
                            <button type="button"
                                onClick={this.modalClose}
                                className="mx-auto btn btn-block btn-width grow button-color">
                                {label.okBtn}
                            </button>
                        </div>
                    </div>
                )
                : (
                    <div className="mx-3">
                        <div className="text-center mb-2">{label.recoveryMailMsg}</div>
                        <form 
                            autoComplete = "on" 
                            onSubmit = { this.resetPassword }
                            ref={ (form) => { this.forgotPasswordForm = form; }}
                            noValidate>
                        
                            <div className = "form-group m-0">
                                <label htmlFor = "emailId">
                                    <span>{label.emailLabel}</span>
                                    <span className = "text-primary">*</span>
                                    <span data-toggle='tooltip' className="help" title={label.emailFromat}>
                                        <MaterialIcon icon='help outline' size={20} />
                                    </span>

                                </label>

                                <Input  type = "email" 
                                    name = "emailId"
                                    id = "emailId" 
                                    value = { forgotPswd.emailId }
                                    required = { true }
                                    regex = {new RegExp(AppConfig.emailRegex)}
                                    warning={errorMsgs.reset }
                                    error={forgotPswd.errorMsg }/>
                            </div>
                            <div className="d-flex flex-row justify-content-around mt-3 mb-2">
                                <button type="button"
                                    onClick={this.modalClose}
                                    className="btn btn-width grow button-color">
                                    {label.cancelBtn}
                                </button>
                                <button type="submit"
                                    className="btn btn-width grow button-color">
                                    {label.resetBtn}
                                </button>

                            </div>
                            <small
                                className = "form-text text-primary">
                                {label.reqLabel}
                            </small>
                        </form>
                    </div>
                )
        );
                
    }
}
ForgotPassword.propTypes = {
    Store: PropTypes.object,
    onClick: PropTypes.func
};
export default ForgotPassword;