/**
* @author Ritesh Kumar <ritkumar2@publicisgroupe.net>
* @description A Delete Modal component.
* @returns { element } - A delete modal component which deleteds the selected nominations.
*/

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {inject, observer} from 'mobx-react';
import firebase from '../../config/firebase';
import label from '../../../public/label.json';

@inject('Store')
@observer
class DeleteModal extends Component  {
    constructor ( props ) {
        super ( props );
        this.closeModal = this.closeModal.bind(this);
        this.deleteNomination=this.deleteNomination.bind(this);
    }
    //close the delete modal on clicking cancel button
    closeModal(e) {
        e.preventDefault();
        const { Store } = this.props;
        Store.showDeleteModal(false);
    }
    /**
    * @description delete the selected nominee from nomineelist 
    *              table as well as from nominations node in firebase
    */
    deleteNomination () {
        const {Store} = this.props, 
            { userDetail } = Store;
        const userInfo = userDetail;
        const superviseeId = this.props.oracleid;
        if (userInfo.isRecruiter) {
            const ref= firebase.database().ref('nominations/');
            ref.orderByChild('OracleID').equalTo(superviseeId).once('value', function(snapshot) {  
                let supervisee = Object.keys(snapshot.val());
                let superviseesInfo = Store.nomineeList.nominatedEmp;
                const i =superviseesInfo.findIndex(data => data.oracleID === parseInt(superviseeId) );
                superviseesInfo.splice(i, 1);
                Store.nominatedEmp(superviseesInfo);
                ref.child(supervisee[0]).remove();
            });
        }
        Store.showDeleteModal(false);
    }    

    render() {
        return (
            <div>
                <div>
                    <p>
                        {label.deleteNominationWarning}
                    </p>
                </div>
                <div className="d-flex flex-row justify-content-around mt-4 mb-0">
                    <button
                        type="button"
                        className="btn btn-block button-color grow btn-width"
                        onClick={this.closeModal}> {label.cancelBtn}
                    </button>
                    <button
                        type="button"
                        className="btn btn-block button-color grow btn-width mt-0"
                        onClick={this.deleteNomination} >{label.saveBtn}
                    </button>
                </div>
            </div>
        );
    }
}

export default DeleteModal;

DeleteModal.propTypes = {
    Store: PropTypes.object,
    oracleid: PropTypes.number
};