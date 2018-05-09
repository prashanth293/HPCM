/**
* @author Archana Kumari <arckumar2@publicisgroupe.net>
* @author Prashanth Reddy <somreddy@publicisgroupe.net>
* @description A NomineeList component.
* @returns {element} - A nominee-list Component which presents nominated persons data
 in a tabular format and provides various search, sort and filter functionality.
*/

import React, {Fragment} from 'react';
import MaterialIcon from 'react-google-material-icons';
import { Link} from 'react-router-dom';
import firebase from '../../config/firebase';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import errorMsgs from '../../../public/error-messages.json';
import label from '../../../public/label.json';
//styles
import './style.css';
import '../../styles/global.css';
import '../../styles/theme.css';
//components
import Search from '../Search/';
import Header from '../Header/';
import Footer from '../Footer/';
import Modal from '../Modal/';
import Sorting from '../Sorting/';
import TableRow from '../TableRow';
import Checkbox from '../Checkbox/';
import Loader from '../Loader/';
import EditModal from '../EditModal/';
import DeleteModal from '../DeleteModal/';
@inject('Store')
@observer
class NomineeList extends React.Component {
    constructor(props) {
        super(props);
        this.sortingModal=this.sortingModal.bind(this);
        this.sorting=this.sorting.bind(this);
        this.closeSorting=this.closeSorting.bind(this);
        this.getSortedValue = this.getSortedValue.bind(this);
        this.handleSearch =this.handleSearch.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.closeFilterModal = this.closeFilterModal.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.statusPending = this.statusPending.bind(this);
        this.statusInProcess = this.statusInProcess.bind(this);
        this.statusCompletion = this.statusCompletion.bind(this);
        this.handleRowHover = this.handleRowHover.bind(this);
        this.closeRowHover = this.closeRowHover.bind(this);
        this.state = {
            loading: true,
            currentActive: null,
            display: false,
            pending: false,
            inProcess: false,
            completed: false,
            rowInfo: [],
            filterMessage: 'All',
            sortedMessage: 'Relevance'
        };
    }
    /**
    * @description Listening for auth state changes and retrieve the userDetails from database
    */
    componentWillMount() {
        const { Store } = this.props;
        Store.changeHeader(false, true);
        //firebase Authentication
        this.firebaseAuth = firebase
            .auth()
            .onAuthStateChanged((user) => {
                if (user) {
                    const uid = user.uid;
                    const ref = firebase.database().ref('users/' + uid);
                    ref.once('value', (snapshot) => {
                        Store.getUserData(snapshot.val());
                    }).then(() => {
                        const nominationsRef = firebase.database().ref('nominations/'),
                            { userDetail } = Store,
                            isRecruiter = userDetail.isRecruiter;

                        if (isRecruiter) {
                            nominationsRef.on('value', (snapshot) => {
                                const nominationInfo = snapshot.val();
                                if (nominationInfo) {
                                    const nominatedEmp = Object.keys(nominationInfo).map(e => nominationInfo[e]);
                                    Store.nominatedEmp(nominatedEmp);
                                    Store.setFilterList(nominatedEmp);
                                    //if filtering status is present in local storage 
                                    if (localStorage['statusArray']) {
                                        const statusArray = localStorage.getItem('statusArray');
                                        Store.setCheckBoxStatus(JSON.parse(statusArray));
                                        this.filterList();
                                    }
                                    //if sorting status is present in local storage 
                                    if (localStorage.getItem('sortingStatus')) {
                                        const sortingMethod = localStorage.getItem('sortingStatus');
                                        Store.setSortingMethod(sortingMethod);
                                        this.getSortedValue(sortingMethod);
                                    }
                                    this.setState({ loading: false });
                                }
                                else {
                                    this.setState({ loading: false });
                                }
                            });
                        } else {
                            nominationsRef
                                .orderByChild('nominatedBy')
                                .equalTo(userDetail.OracleID)
                                .on('value', (snapshot) => {
                                    const nominationInfo = snapshot.val();
                                    if (nominationInfo) {
                                        const nominatedEmp = Object.keys(nominationInfo).map(e => nominationInfo[e]);
                                        Store.nominatedEmp(nominatedEmp);
                                        Store.setFilterList(nominatedEmp);
                                        if (localStorage['statusArray']) {
                                            const statusArray = localStorage.getItem('statusArray');
                                            Store.setCheckBoxStatus(JSON.parse(statusArray));
                                            this.filterList();
                                        }
                                        if (localStorage.getItem('sortingStatus')) {
                                            const sortingMethod = localStorage.getItem('sortingStatus');
                                            this.getSortedValue(sortingMethod);
                                        }
                                        this.setState({ loading: false });
                                    }
                                    else {
                                        this.setState({ loading: false });
                                    }
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
    }
    //open the sorting modal
    sortingModal() {
        this.props.Store.sortModal(true);
    }
    /**
    * @description sort the nominatedEmp(array of objects) in nomineelist store 
    * @param {string} - type of sorting method
    */
    getSortedValue(sortingMethod) {
        
        const { Store } = this.props;
        Store.setSortingMethod(sortingMethod);
        let SortedValue = [];
        this.setState({ sortedMessage: sortingMethod });
        switch (sortingMethod) {
        case 'Name Ascending': SortedValue = Store.ascendingByName;
            break;
        case 'Name Descending': SortedValue = Store.descendingByName;
            break;
        case 'Id Ascending': SortedValue = Store.ascendingById;
            break;
        case 'Id Descending': SortedValue = Store.descendingById;
            break;
        case 'Status high to low': SortedValue = Store.ascendingByStatus;
            break;
        case 'Status low to high': SortedValue = Store.descendingByStatus;
            break;
        }
        Store.nominatedEmp(SortedValue);
        Store.setSortErrorMsg(errorMsgs.reset);

    }

    /**
    * @description submit handler of sorting modal.
    *               It passes the sortingMethod to getSortedvalue method
    */
    sorting() {
        const {Store} = this.props;
        const checkedRadioBtn = document.querySelector('input[name=sorting]:checked');
        if (checkedRadioBtn) {
            const sortingMethod = checkedRadioBtn.value;
            localStorage.setItem('sortingStatus', sortingMethod);
            this.getSortedValue(sortingMethod);
            Store.sortModal(false);        
        }
        else {
            Store.setSortErrorMsg(errorMsgs.sortErrorMsg);   
        }
    }

    /**
    * @description close the sorting modal on  clicking cancel button of sorting modal
    */
     
    closeSorting() {
        const {Store} = this.props;
        Store.sortModal(false);
        Store.setSortingMethod(localStorage.getItem('sortingStatus'));
        Store.setSortErrorMsg(errorMsgs.reset);
    }

    //store the search input query in observable query field
    handleSearch(query) {
        const {Store} = this.props;
        Store.setQuery(query);
        //calls the computed function searchQuery
        Store.searchQuery;
    }

    //clears the value of search input
    clearSearch() {
        this.props.Store.setQuery('');
    }

    //set the index of hovered row
    handleRowHover(index) {
        this.setState({
            currentActive: index
        });
    }
    //on mouse leave set the active index to null
    closeRowHover() {
        this.setState({
            currentActive: null
        });
    }

    //open the filter modal on clicking filter icon
    handleFilter() {
        this.setState({
            display: true,
        });
    }

    //reverse the checked status of pending label in filter modal
    statusPending() {
        this.setState({pending: !this.state.pending});
    }

    //reverse the checked status of In-process label in filter modal
    statusInProcess() {
        this.setState({inProcess: !this.state.inProcess});
    }

    //reverse the checked status of Completed label in filter modal
    statusCompletion() {
        this.setState({completed: !this.state.completed});
    }

    // closes the filter modal on clicking cancel button
    closeFilterModal() {
        this.setState({
            display: false
        });
    }

    /**
    * @description open the edit modal and set the details of nominee in an array rowInfo
    * @param {object} - details of hovered row in nomineelist 
    */
    editNomination(data) {
        this.props.Store.showEditModal(true);
        this.setState({
            rowInfo: data
        });
    }
    /**
    * @description open the delete modal and set the oracleid of active nominee in oracle id
    * @param {object} - details of hovered row in nomineelist
    */
    showDltModal(data) {
        this.props.Store.showDeleteModal(true);
        this.props.Store.delNom(data);
    }
                                                
    /**
    * @description filter functionality for selected status(pending,in-process,completed) from filter modal
    */
    applyFilter() {
        const {Store} = this.props;
        const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
        let checkedValues = [];
        if (checkedBoxes.length) {
            //if one or more than one option is checked
            for (let i=0; i<checkedBoxes.length ;i++) {
                checkedValues.push(checkedBoxes[i].value.toLowerCase());
            }
            localStorage.setItem('statusArray', JSON.stringify(checkedValues)); 
            Store.setCheckBoxStatus(checkedValues);
                 
            this.setState({
                display: false,
                filterMessage: checkedValues.join(' or ')
            });
        }
        else {
            //if no option is selected from filter list
            const checkBoxStatus= ['pending', 'in-process', 'completed'];
            Store.setCheckBoxStatus(checkBoxStatus);
            localStorage.removeItem('statusArray');
            this.setState({
                display: false,
                filterMessage: 'All'
            });
        }
        //store the filtered list in nominatedEmp list of store
        Store.nominatedEmp(Store.statusFilter);
        if (localStorage.getItem('sortingStatus')) {
            const sortingMethod = localStorage.getItem('sortingStatus');
            this.getSortedValue(sortingMethod);
        }  
    }
    /**
    * @description retain the filtering status on refresh or page redirect if 
    *               any option from filter modal was selected prior to it
    */
    filterList() {
        const { Store } = this.props;
        const filteredArray = Store.nomineeList.checkBoxStatus;
        filteredArray.forEach((element) => {
            if (element === 'in-process') {
                this.setState({inProcess: true});
            }
            if (element === 'pending') {
                this.setState({pending: true});
            }
            if (element === 'completed') {
                this.setState({completed: true});
            }
        });
        Store.nominatedEmp(Store.statusFilter);
        //filter status message above nomineelist
        this.setState({
            filterMessage: filteredArray.join(' or ')
        });
    }

    render() {
        const { state } = this,
            {currentActive, rowInfo} = state,
            {Store} = this.props,
            { userDetail, nomineeList} = Store, 
            {name} = userDetail,
            { sortModal, sortErrorMsg} = nomineeList;

        const filteredList = Store.searchQuery;
        document.title = name || label.appTitle;
        const loaderWrapper=this.state.loading ?  'loader-wrapper': '';
        const loader=this.state.loading ?  'loader': '';
        return (  
            <Fragment>
                <Loader loaderWrapper={loaderWrapper} loader= {loader}/>
                <Header title={label.appTitle} username={name} profileInfo={label.profileLabel}/>
                <div className="container-fluid container-margin">
                    <div className=" mx3-mobile-view footer-margin">
                        <div className="row">
                            <div className="col-7 col-sm-5 col-md-4 col-lg-3 col-xl-3 section-margin">
                                <div>
                                    <h5 className="panel-text header-text-color pl-3">{label.panelHead}</h5>
                                    <div className="searchbar-margin pl-3">
                                        <Search onChange = {this.handleSearch}
                                            onClick = {this.clearSearch}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 offset-1 col-sm-3 offset-sm-4 col-md-4 offset-md-4 col-lg-3 offset-lg-6 col-xl-3 offset-xl-6 section-margin filter-margin">
                                <div className=" d-inline-block" >
                                    <Link to="/newnomination" className=" link link-default-color pr-3 align-item-center">
                                        <span className="mat-icon-color d-inline-block">
                                            <MaterialIcon icon='add_circle' size={30} />
                                        </span>
                                        <span>
                                            <h4 className="nominee-header header-text-color hide">
                                                {label.nominateLink}
                                            </h4>
                                        </span>
                                    </Link>
                                </div>
                                <div className="filter-wrapper pr-3">
                                    <button onClick={this.sortingModal} 
                                        className="filter-bttn mat-icon-color pr-2 sortbtn">
                                        <MaterialIcon icon='sort' size={30} />
                                        <span className="hide">{label.sortIcon}</span>
                                    </button>
                                    <button onClick={this.handleFilter} 
                                        className="filter-bttn mat-icon-color pl-1 pr-0 filterbtn">
                                        <MaterialIcon icon='filter_list'size={30} />
                                        <span className="hide">{label.filterIcon}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="pl-3 pr-3 mt-4 mb-2 message-text d-flex">
                            <div className="mr-auto">{label.showFilteringStatus}<b>{state.filterMessage}</b></div>
                            <div className="ml-auto">{label.sortingLabel}<b>{state.sortedMessage}</b></div>
                        </div>
                        <div className='table-leftMargin table-margin'>
                            <div className="mobile-view">
                                <div className="row boundary-line tabletop-margin table-header table-header-color">
                                    <div className="col-12 col-md-2 side-border text-style">
                                        <span><b>{label.idType}</b></span>
                                    </div>
                                    <div className="col-12 col-md-4 side-border text-style">
                                        <span ><b>{label.name}</b></span>
                                        <span className=""><b>(Designation)</b></span>
                                    </div>
                                    <div className="col-12 col-md-3 side-border text-style">
                                        <span><b>{label.email}</b></span>
                                    </div>
                                    <div className="col-12 col-md-3 text-style">
                                        <span><b>{label.status}</b></span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {filteredList.map((data, index) => <TableRow
                                    oracleid={data.OracleID}
                                    name={data.name}
                                    title={data.designation}
                                    email={data.email}
                                    status={data.status}
                                    index={index}
                                    isActive={currentActive === 'null' ? false : index === currentActive}
                                    onMouseEnter={this.handleRowHover}
                                    onMouseLeave={this.closeRowHover}
                                    key={data.OracleID} 
                                    showDltModal={this.showDltModal.bind(this, data)}
                                    editDataModal={this.editNomination.bind(this, data)}/>)}
                            </div>   
                        </div>
                        <div>
                            {
                                (!filteredList.length)
                                    ? <div className="pl-3 mt-2 panel-text">{label.nomineeNotFound}</div>
                                    : null
                            }
                        </div>
                    </div>
                    <Modal display={sortModal} modalHeading={label.sortHead}>
                        <div>
                            <Sorting/>
                            <div className="d-flex">
                                <div>
                                    <button onClick={this.closeSorting} 
                                        className='btn grow button-color  mr-2 mt-2'>
                                        {label.closeBtn}
                                    </button>
                                </div>
                                <div>
                                    <button onClick={this.sorting} 
                                        className='btn grow button-color ml-4 mr-2 mt-2'>
                                        {label.applyBtn}
                                    </button>
                                </div>
                            </div>
                            <div className="errorMsg">{sortErrorMsg}</div>
                        </div>
                    </Modal>
                    {/* filtering modal */}
                    <Modal display= {state.display} modalHeading= {label.filterHead}>
                        <div>
                            <div>{label.filterSubHead}</div>
                            <div>
                                <div>
                                    <Checkbox checked = {state.pending } 
                                        id = "pending-status" 
                                        name = "pending"
                                        onChange = { this.statusPending }/>
                                    <label htmlFor = "pending-status" className="login-label-color pl-1 pointer">
                                        {label.statusPending}
                                    </label>
                                </div>
                                
                                <div>
                                    <Checkbox checked = { state.inProcess } 
                                        id = "in-process" 
                                        name = "in-process"
                                        onChange = { this.statusInProcess }/>
                                    <label htmlFor = "in-process" className="pointer login-label-color pl-1">
                                        {label.statusInProcess}
                                    </label>
                                </div>
                                <div>
                                    <Checkbox checked = { state.completed } 
                                        id = "status-completed" 
                                        name = "completed" 
                                        onChange = { this.statusCompletion }/>
                                    <label htmlFor = "status-completed" className=" pointer login-label-color pl-1">
                                        {label.statusCompleted}
                                    </label>
                                </div>
                            </div>
                            <div>
                                <button type="button" onClick={this.closeFilterModal}
                                    className="btn grow button-color  mr-2 mt-2">
                                    {label.cancelBtn}
                                </button>
                                <button type="button" 
                                    className="btn grow button-color ml-4 mt-2" 
                                    onClick={this.applyFilter}>
                                    {label.applyBtn}
                                </button>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        display={Store.editModal}
                        modalHeading="Edit Data">
                        <EditModal name={rowInfo.name}
                            oracleId={rowInfo.OracleID} 
                            title={rowInfo.designation} 
                            email={rowInfo.email} 
                            status={rowInfo.status}/>
                    </Modal>
                    <Modal
                        display={Store.deleteModal}
                        modalHeading="Delete Nomination">
                        <DeleteModal oracleid={nomineeList.oracleId} />
                    </Modal>
                </div>
                <Footer footerText="&copy; Copyright 2018 HPCM"/>
            </Fragment>
        );
    }
}
NomineeList.propTypes = {
    Store: PropTypes.object
};
export default NomineeList;