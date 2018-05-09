/**
* @author Saumya Shree <saushree@publicisgroupe.net>
* @description An Input component.
* @param { string } props - input field attributes.
* @returns { element } - An input element which has props passed as string as its attributes
*/

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {inject, observer} from 'mobx-react';

@inject('Store')
@observer
class Input extends Component {
    constructor ( props ) {
        super ( props );

        this.state = {
            field: this.props.value,
            warningInfo: '',
        };

        this.handleInputChange = this.handleInputChange.bind( this );
        this.getErrorMessage = this.getErrorMessage.bind( this );
    }

    /**
    * @description handles errors and validations on input field
    * @param - value of the input field 
    * @returns the error or invalidation
    */
    getErrorMessage( value ) {
        
        const { warning, regex } = this.props;

        if ( !regex.test( String( value ) ) ) {
            return new Error(
                warning	
            );
        }
        else {
            return null;
        }
    }

    /**
    * @description - fires when input changes in form field and sets the state accordingly
    * @param -  event taget/input field
    * @returns a new state of the component
    */
    handleInputChange( event ) {
        const { Store } = this.props;
        const  { value } = event.target,
            error = this.getErrorMessage( value );
        //clear all the error message
        Store.clearAllError();
        if ( error && value ) {
            this.setState( {
                warningInfo: error.message,
            } );
            Store.changeinputEditState(true);
        }
        else if ( !value ) {
            this.setState( {
                warningInfo: '',
            } );
            Store.changeinputEditState(false);
        }
        else {
            this.setState( {
                warningInfo: '',
            } );
            Store.changeinputEditState(true);
        }
    
        this.setState( {
            field: value
        } );
    }

    render() {
        const { props, state } = this,
            { type, name, id, required, regex, error, Store } = props,
            { warningInfo, field } = state;

        return (
            <div>

                <input
                    type = { type }
                    name = { name }
                    id = { id }
                    placeholder = { `Enter ${ name }` }
                    className = "form-control"
                    value = { field }
                    required = { required }
                    regex = { regex }
                    onChange = { this.handleInputChange } />

                <small className={`${Store.inputEditing ? 'text-info' : 'text-danger font-weight-bold' } form-text` } > 
                    { Store.inputEditing? warningInfo :  error }
                </small>
                
            </div>
        );
    }
}

export default Input;

Input.propTypes = {
    error: PropTypes.string,
    regex: PropTypes.instanceOf(RegExp),
    warning: PropTypes.string,
    required: PropTypes.bool,
    value: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    Store: PropTypes.object,
    onChange: PropTypes.func
};