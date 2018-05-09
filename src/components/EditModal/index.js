/**
* @author Ritesh Kumar <ritkumar2@publicisgroupe.net>
* @description A Edit Modal component.
* @returns { element } - An edit modal component which edits and saves the status of selected nominations.
*/

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {inject, observer} from 'mobx-react';
import firebase from '../../config/firebase';
import * as emailjs from 'emailjs-com';
import label from '../../../public/label.json';
import AppConfig from '../../../public/app-config.json';
@inject('Store')
@observer
class EditModal extends Component  {
    constructor ( props ) {
        super ( props );
        this.closeModal = this.closeModal.bind(this);
        this.saveStatus = this.saveStatus.bind(this);
    }
    //closes edit modal on clicking cancel button
    closeModal(e) {
        e.preventDefault();
        const { Store } = this.props;
        Store.showEditModal(false);
    }
    /**
    * @description update the status of the selected supervisee
    */
    saveStatus() {
        const value = document.querySelector('select').value,
            { Store, oracleId } = this.props,
            userInfo = Store.userDetail,
            superviseeId = oracleId,
            selectedOption = value;
        if (userInfo.isRecruiter) {
            const ref = firebase.database().ref('nominations/');
            ref
                .orderByChild('OracleID')
                .equalTo(superviseeId)
                .on('value', function(snapshot) {
                    if (snapshot.val()) {
                        const supervisee = Object.keys(snapshot.val());
                        ref.child(supervisee[0]).update({
                            status: selectedOption
                        });
                    } 
                });
        }
        Store.showEditModal(false);
        //emailjs
        emailjs.init('user_G9DuBOofqoI2CscSSqjK5');
        if (selectedOption!==this.props.status) {
            AppConfig.mailingList.map((email) => {
                const template_params = {
                    team: email,
                    nominator: userInfo.email,
                    name: this.props.name,
                    supervisor: userInfo.name,
                    status: selectedOption
                };	
                emailjs.send('team_hpcm', 'nomination_status', template_params, 'user_G9DuBOofqoI2CscSSqjK5');
            });
        }
    }

    render() {
        const { oracleId, name, title, email, status } = this.props;
        return (
            <div>
                <div className='form-row'>
                    <div>
                        <div className='mb-4'>{oracleId}</div>
                        <div className='mb-4'>
                            <div> {name}</div>
                            <div> {title}</div>
                            <div> {email}</div>
                        </div>
                        <div className='d-flex'>
                            <div className='pr-3'>{label.status}</div>
                            <span>
                                <select
                                    defaultValue= {status}
                                    className='selectpicker py-1'>
                                    <option value='Pending'>{label.statusPending}</option>
                                    <option value='In-Process'>{label.statusInProcess}</option>
                                    <option value='Completed'>{label.statusCompleted}</option>
                                </select>
                            </span>
                        </div>
                    </div>
                </div>
        
                <div className='d-flex flex-row justify-content-around mt-4 mb-0'>
                    <button
                        type='button'
                        className='btn btn-block btn-width grow button-color'
                        onClick={this.closeModal}>Cancel
                    </button>
                    <button
                        type='button'
                        className='btn btn-block button-color grow btn-width mt-0'
                        onClick={this.saveStatus}>Save
                    </button>
                </div>
            </div>
        );
    }
}

export default EditModal;

EditModal.propTypes = {
    email: PropTypes.string,
    oracleId: PropTypes.number,
    name: PropTypes.string,
    title: PropTypes.string,
    status: PropTypes.string,
    Store: PropTypes.object
};