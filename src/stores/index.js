/**
 * @author Archana Kumari <arckumar2@publicisgroupie.net>
 * @author Prashanth Reddy <somreddy@publicisgroupe.net>
 * @class Represents the observable component state and
          action for the changed state and computed function for observable list
 */
import {observable, action, computed} from 'mobx';

class Store {
    //login component variables
    @observable loginState = {
        authenticated: false,
        rememberMe: false,
        redirect: false,
        userValue: '',
        errorMsg: '',
        emailErrorMsg: '',
        pswdErrorMsg: '',
        showforgotPswdModal: false
    }
    //forgotpassword component variables
    @observable forgotPswd = {
        redirect: false,
        errorMsg: '',
        msg: '',
        emailId: ''
    }
    //resetpassword component variables
    @observable newPswd = {
        errorMsg: '',
        confirmErr: ''
    }
    @observable userDetail = {
        OracleID: '',
        designation: '',
        email: '',
        image: '',
        isRecruiter: false,
        name: '',
        supervisorId: ''
    };
    @observable header = {
        isHidden: false,
        icon: true
    }
    @observable nomineeList = {
        nominatedEmp: [],
        sortErrorMsg: '',
        sortModal: false,
        query: '',
        checkBoxStatus: [],
        filterList: [],
        oracleId: null,
    }
    @observable newNomination = {
        supervisees: [],
        supervisorId: 1000,
        errorMsg: ''
    }
   
    @observable activeRow = false;
    @observable editModal = false;
    @observable deleteModal = false;
    @observable pendingStatus = {
        isEditing: false
    }
    //observing input field of input component
    @observable inputEditing = false;
    
    @observable sortingMethod = '';

    //update the sortingMethod value
    @action setSortingMethod = (value) => {
        this.sortingMethod = value;
    }
    
    //action for changing edit state of input field
    @action changeinputEditState = (bool) => {
        this.inputEditing = bool;
    }
    
    //action for userDetails info
    @action getUserData = (data) => {
        this.userDetail = data;
    }

    //action for loginstate properties
    @action rememberMeState = (bool) => {
        this.loginState.rememberMe = bool;
    }
    @action redirectState = (bool) => {
        this.loginState.redirect = bool;
    }
    @action authState = (bool) => {
        this.loginState.authenticated = bool;
    }
    @action setErrorMsg = (msg) => {
        this.loginState.errorMsg = msg;
        this.loginState.emailErrorMsg = '';
        this.loginState. pswdErrorMsg = '';
    }
    @action setEmailErrorMsg = (msg) => {
        this.loginState.emailErrorMsg = msg;
        this.loginState.errorMsg = '';
        this.loginState. pswdErrorMsg = '';
    }
    @action setPswdErrorMsg = (msg) => {
        this.loginState. pswdErrorMsg = msg;
        this.loginState.errorMsg = '';
        this.loginState.emailErrorMsg = '';
    }
    @action getUserValue = (val) => {
        this.loginState.userValue = val;
    }
    @action resetPswd = (bool) => {
        this.loginState.showforgotPswdModal = bool;
    }

    //action for forgotpassword properties
    @action forgotPswdSuccess = (msg) => {
        this.forgotPswd.msg = msg;
    }
    @action forgotPswdErrorMsg = (msg) => {
        this.forgotPswd.errorMsg = msg;
    }
    @action forgotPswdRedirect = (bool) => {
        this.forgotPswd.redirect = bool;
    }

    //action for new password properties
    @action newPswdErrorMsg = (msg) => {
        this.newPswd.errorMsg = msg;
    }
    @action confirmPswdErrorMsg = (msg) => {
        this.newPswd.confirmErr = msg;
    }

    //clear all error message
    @action clearAllError = () => {
        this.loginState.errorMsg = '';
        this.loginState.emailErrorMsg = '';
        this.loginState.pswdErrorMsg = '';
        this.forgotPswd.errorMsg = '';
        this.newPswd.errorMsg = '',
        this.newPswd.confirmErr = '';
    }
    //action for changeHeader properties
    @action changeHeader = (bool1, bool2) => {
        this.header.isHidden = bool1;
        this.header.icon = bool2;
    }
    //acition  for nomineeList properties
    @action nominatedEmp = (data) => {
        this.nomineeList.nominatedEmp = data;
    }
    @action setFilterList = (data) => {
        this.nomineeList.filterList = data;
    }
    @action sortModal = (bool) => {
        this.nomineeList.sortModal = bool;
    }
    @action setSortErrorMsg = (msg) => {
        this.nomineeList.sortErrorMsg = msg; 
    }
    @action setCheckBoxStatus = (statusArray) => {
        this.nomineeList.checkBoxStatus = statusArray;
    }
    @action setQuery = (data) => {
        this.nomineeList.query = data;
    } 

    //action for newnomination properties
    @action superviseesList = (data) => {
        this.newNomination.supervisees = data;
    }
    @action supervisorId = (num) => {
        this.newNomination.supervisorId = num;
    }
    @action duplicateNomination = (msg) => {
        this.newNomination.errorMsg = msg;
    }

    @action changePendingStatus = (bool) => {
        this.pendingStatus.isEditing = bool ;
    }
    @action activeClass = (bool) => {
        this.activeRow = bool;
    }
    //action for Modal properties
    @action showEditModal = (bool) => {
        this.editModal = bool;
    }
    @action showDeleteModal = (bool) => {
        this.deleteModal = bool;
    }

    @action delNom=(data) => {
        this.nomineeList.oracleId = data.OracleID;
    }
    
    /**
    * @description sorting list by ascendingId.
    * @returns { array  } - sorted array of objects
    */
    @computed get ascendingById() {
        return this.nomineeList.nominatedEmp.sort(function (a, b) {
            return a.OracleID - b.OracleID;
        });
    }
    /**
    * @description sorting list by descendingId.
    * @returns { array  } - sorted array of objects
    */
    @computed get descendingById() {
        return this.nomineeList.nominatedEmp.sort(function (a, b) {
            return b.OracleID - a.OracleID;
        });
    }
    /**
    * @description sorting list by ascendingname.
    * @returns { array  } - sorted array of objects
    */
    @computed get ascendingByName() {
        return this.nomineeList.nominatedEmp.sort(function (a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        });
    }
    /**
    * @description sorting list by descending name.
    * @returns { array  } - sorted array of objects
    */
    @computed get descendingByName() {
        return this.nomineeList.nominatedEmp.sort(function (a, b) {
            if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
            else if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
            return 0;
        });
    }
    /**
    * @description sorting list by descendingstatus.
    * @returns { array  } - sorted array of objects
    */
    @computed get descendingByStatus() {
        let ordering = {},
            sortOrder = ['pending', 'in-process', 'completed'];
        for (let i=0; i<sortOrder.length; i++)
            ordering[sortOrder[i]] = i;  
        return this.nomineeList.nominatedEmp.sort( function(a, b) {
            return (ordering[a.status.toLowerCase()] - ordering[b.status.toLowerCase()]);
        });
    }
    /**
    * @description sorting list by ascendingstatus.
    * @returns { array  } - sorted array of objects
    */
    @computed get ascendingByStatus() {
        let ordering = {},
            sortOrder = ['completed', 'in-process', 'pending'];
        for (let i=0; i<sortOrder.length; i++)
            ordering[sortOrder[i]] = i;   
        return this.nomineeList.nominatedEmp.sort( function(a, b) {
            return  (ordering[a.status.toLowerCase()] - ordering[b.status.toLowerCase()]);
        });
    }

    /**
    * @description filtering the  list as per Query.
    * @returns { array  } - filtered array of objects
    */
    @computed get searchQuery() {
        const query= this.nomineeList.query;
        return this.nomineeList.nominatedEmp.filter((data) => {
            return (data.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
                || data.email.indexOf(query.toLowerCase()) !== -1
                || data.OracleID.toString().indexOf(query) !== -1
            );
        });
    }

    /**
    * @description filtering the  list as per status of nomineelist.
    * @returns { array  } - filtered array of objects
    */
    @computed get statusFilter() {
        const filterArray = this.nomineeList.checkBoxStatus;
        const newList =  this.nomineeList.filterList.filter((data) => {
            return filterArray.indexOf(data.status.toLowerCase()) !== -1;
        });
        return newList;
    }
}

export default new Store();

