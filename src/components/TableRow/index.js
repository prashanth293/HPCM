/**
* @author Archana Kumari <arckumar2@publicisgroupe.net>
* @description A table-row component.
* @param {string} props - Text to be showed on the row-cell.
* @returns {element} - A table-row with string params for each cell.
*/

import React, {Component} from 'react';
import './style.css';
import '../../styles/theme.css';
import {inject, observer} from 'mobx-react';
import {PropTypes} from 'prop-types';
import MaterialIcon from 'react-google-material-icons';
import label from '../../../public/label.json';

@inject('Store')
@observer
class TableRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false
        };
        this.activeClass = this.activeClass.bind(this);
        this.disactiveClass = this.disactiveClass.bind(this);
    }
 
    activeClass() {
        const { onMouseEnter, index} = this.props;
        if (typeof(onMouseEnter) === 'function') {
            onMouseEnter(index);
        }
    }

    disactiveClass() {
        const { onMouseLeave } = this.props;
        if (typeof(onMouseLeave) === 'function') {
            onMouseLeave(null);
        }
    }
    componentDidMount() {
        const { Store } = this.props;
        const userInfo = Store.userDetail;
        if (!userInfo.isRecruiter) {
            this.setState({
                disabled: true
            });
        }
    }

    render() {
        const {props, state} = this;
        const { status, isActive } = this.props;
        const className = isActive ? 'style' : '';
        return (
            <div
                className={`row boundary-line top-border table-color mb-4 mb-md-0 ${className}`}
                onMouseEnter={this.activeClass} onMouseLeave={this.disactiveClass}>
                <div className="col-12 col-md-2 side-border text-style ">
                    <span className="text-margin">{props.oracleid}</span>
                </div>
                <div className="col-12 col-md-4 side-border text-style ">
                    <span >{props.name}</span>
                    <span className="table-text">({props.title})</span>
                </div>
                <div className="col-12 col-md-3 side-border text-style">
                    <span className="text-margin">{props.email}</span>
                </div>
                <div className="col-12 col-md-3 text-style">
                    { isActive ? (
                        <div>
                            <div className="d-flex edit-style">
                                <button className="d-flex filter-bttn text-margin" 
                                    disabled={state.disabled}
                                    onClick={props.editDataModal}>
                                    <div >
                                        <MaterialIcon icon='mode_edit' size={20} />
                                    </div>
                                    <span>{label.edit}</span>
                                </button>
                                <button className="d-flex ml-4 filter-bttn text-margin"
                                    disabled={state.disabled}
                                    onClick={props.showDltModal}>
                                    <div>
                                        <MaterialIcon icon='delete' size={20}/>
                                    </div>
                                    <span>{label.delete}</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <span className="text-margin">{status}</span>
                        </div>
                    )}
                </div>
              
            </div>
        );
    }
}

export default TableRow;
TableRow.propTypes = {
    oracleid: PropTypes.number,
    name: PropTypes.string,
    title: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.string,
    Store: PropTypes.object,
    isActive: PropTypes.bool,
    index: PropTypes.number,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    editDataModal: PropTypes.func,
    showDltModal: PropTypes.func
};