/**
* @author Archana Kumari <arckumar2@publicisgroupe.net>
* @description A Search component.
* @returns {element} - A Search element with search and cancel material-icons.
*/

import React from 'react';
import './style.css';
import '../../styles/theme.css';
import PropTypes from 'prop-types';
import MaterialIcon from 'react-google-material-icons';

class Search extends React.Component {
    constructor() {
        super();
        this.crossClickHandler = this
            .crossClickHandler
            .bind(this);
        this.handleInputChange = this
            .handleInputChange
            .bind(this);
    }
    crossClickHandler() {
        this.input.value='';
        this.props.onClick();
    }
    handleInputChange() {
        this.props.onChange(this.input.value);
    }
    render() {
        return (
            <div className="search-field-wrapper click-pointer search-wrap-color icon-color" >
                <span className="search-icon pl-1"><MaterialIcon icon='search'/></span>
                <span>
                    <input
                        className="search"
                        type="text"
                        placeholder="Search"
                        ref=
                            {(value) => {this.input = value;}}
                        onChange = {this.handleInputChange}/>
                </span>
                <span  className="search-icon" onClick ={this.crossClickHandler}><MaterialIcon icon='cancel'/></span>      
            </div>
        );
    }
}
Search.propTypes = {
    onChange: PropTypes.func,
    onClick: PropTypes.func
};
export default Search;