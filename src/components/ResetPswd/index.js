/**
* @author Amit Raushan <amiraush@publicis@groupe.net>
* @description resetpassword component.
* @param {string} props - location of the route
* @returns {element} - an element with HTMl node not found
*/
import React, { Fragment, Component } from 'react';
import firebase from '../../config/firebase.js';
import { inject, observer } from 'mobx-react';
import MaterialIcon from 'react-google-material-icons';
import label from '../../../public/label.json';
import errorMsgs from '../../../public/error-messages.json';
import AppConfig from '../../../public/app-config.json';
import './style.css';
import PropTypes from 'prop-types';
//components
import Modal from '../Modal/';
import Input from '../Input/';

@inject('Store')
@observer
class ResetPswd extends Component {
    constructor(props) {
        super(props);
        this.changePassword = this.changePassword.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.handleResetPassword = this.handleResetPassword.bind(this);
        this.state = {
            resetPswd: true,
            sessionExpire: false,
            redirect: false,
            pswdUpdated: false,
            continueUrl: ''
        };
    }
    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    /**
    * @description Verify the password reset code
    *               and if the code is valid save the new password in firebase
    * @param {string} newpassword to be saved
    * @param {object} firebase auth object
    * @param {string} actioncode to authenticate session and user
    * @param {string} url- after successful password update user is directed to continueUrl
    * 
    */
    handleResetPassword(newPassword, auth, actionCode, continueUrl) {
        this.setState({ continueUrl: continueUrl });
        // Verify the password reset code is valid.
        auth.verifyPasswordResetCode(actionCode).then(() => {
            // Save the new password.
            auth.confirmPasswordReset(actionCode, newPassword).then(() => {
                // Password reset has been confirmed and new password updated.
                this.setState({ pswdUpdated: true, redirect: true });
            }).catch(() => {
                // Invalid or expired action code
                this.setState({ sessionExpire: true, redirect: true });
            });
        }).catch(() => {
            // Invalid or expired action code
            this.setState({ sessionExpire: true, redirect: true });
        });
    }
    
    /**
    * @description  extract information from password reset link
    *               and pass those information alongwith newpassword to handleResetPassword function
    * @param current target
    * 
    */
    changePassword(e) {
        e.preventDefault();
        const { Store } = this.props;
        const actionCode = this.getParameterByName('oobCode'),
            continueUrl = this.getParameterByName('continueUrl'),
            auth = firebase.auth(),
            form = e.target,
            newPassword = form.pswd.value,
            confirmPassword = form.confirmPswd.value,
            regexPassword = new RegExp(AppConfig.passwordRegex);

        Store.changeinputEditState(false);
        if (!newPassword) {
            form.pswd.focus();
            Store.newPswdErrorMsg(errorMsgs.emptyPswdField);

        } else if (!regexPassword.test(String(newPassword))) {
            form.pswd.focus();
            Store.newPswdErrorMsg(errorMsgs.invalidPswd);

        } else if (!confirmPassword) {
            form.confirmPswd.focus();
            Store.confirmPswdErrorMsg(errorMsgs.confirmPswdEmpty);
        } else if (newPassword !== confirmPassword) {
            form.confirmPswd.focus();
            Store.confirmPswdErrorMsg(errorMsgs.confirmPswdError);
        } else {
            Store.newPswdErrorMsg(errorMsgs.reset);
            Store.confirmPswdErrorMsg(errorMsgs.reset);
            this.setState({
                resetPswd: false
            });
            this.resetPasswordForm.reset();
            this.handleResetPassword(newPassword, auth, actionCode, continueUrl);

        }
    }
    // close the newpassword modal and redirect the app to loginpage
    modalClose() {
        this.setState({ redirect: false });
        window.location.href = this.state.continueUrl;
    }
    render() {
        const { newPswd } = this.props.Store;
        const { sessionExpire, pswdUpdated, redirect, resetPswd } = this.state;
        if (pswdUpdated) {
            return (
                <Modal display={redirect} modalHeading={label.pswdUpdateHeading}>
                    <div className="mx-3 text-center">
                        <div>{label.pswdUpdateMsg}</div>
                        <div className="d-flex flex-row justify-content-around mt-4 mb-0">
                            <button type="button"
                                onClick={this.modalClose}
                                className="mx-auto btn btn-block btn-width grow button-color">
                                {label.continueBtn}
                            </button>
                        </div>

                    </div>
                </Modal>
            );
        }
        return (
            sessionExpire
                ? (
                    <Modal display={redirect} modalHeading={label.sessionExpireHeading}>
                        <div className="mx-3 text-center">
                            <div>{label.sessionExpireMsg}</div>
                            <div className="d-flex flex-row justify-content-around mt-4 mb-0">
                                <button type="button"
                                    onClick={this.modalClose}
                                    className="mx-auto btn btn-block btn-width grow button-color">
                                    {label.okBtn}
                                </button>
                            </div>

                        </div>
                    </Modal>

                )
                :
                <Fragment>
                    <Modal display={resetPswd} modalHeading={label.changePswdHeading}>
                        <form
                            onSubmit={this.changePassword}
                            ref={(form) => { this.resetPasswordForm = form; }}
                            noValidate>
                            <div className="form-group">
                                <label htmlFor="pswd">
                                    <span>{label.newPswLabel}</span>
                                    <span className="text-primary">*</span>
                                    <span data-toggle='tooltip' className="help" title={label.pswdSuggestion}>
                                        <MaterialIcon icon='help outline' size={20} />
                                    </span>
                                </label>

                                <Input type="password"
                                    name="password"
                                    id="pswd"
                                    value=''
                                    required={true}
                                    regex={new RegExp(AppConfig.passwordRegex)}
                                    warning={errorMsgs.reset}
                                    error={newPswd.errorMsg} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPswd">{label.confrmPswLabel}
                                    <span className="text-primary">*</span>
                                </label>

                                <Input type="password"
                                    name="password"
                                    id="confirmPswd"
                                    value=''
                                    required={true}
                                    regex={/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,})/}
                                    warning={errorMsgs.reset}
                                    error={newPswd.confirmErr} />
                            </div>

                            <div className="d-flex justify-content-around mt-3 mb-2">
                                <button type="submit"
                                    className="btn btn-width grow button-color">
                                    {label.saveBtn}
                                </button>
                            </div>
                            <small
                                className="form-text text-primary">
                                {label.reqLabel}
                            </small>

                        </form>
                    </Modal>
                </Fragment>
        );

    }

}
ResetPswd.propTypes = {
    Store: PropTypes.object,
};
export default ResetPswd;