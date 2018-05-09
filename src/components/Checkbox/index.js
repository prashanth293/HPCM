/**
* @author Saumya Shree <saushree@publicisgroupe.net>
* @description A Checkbox component.
* @param { string } props - checkbox input attributes.
* @returns { element } - A checkbox element which has props passed as string as its attributes
*/

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

class Checkbox extends Component {
    constructor ( props ) {
        super ( props );
        this.state = {
            checked: this.props.checked
        };
        this.checkValue = this.checkValue.bind( this );
    }

    /** 
    * @description handles checked or unchecked value of checkbox via parent component (Login)
    * @param -  No parameters.
    * @returns nothing
    */
    checkValue() {
        this.props.onChange();
    }

    render() {

        const { props, state } = this,
            { id, name } = props;

        return (
            <input type = "checkbox"
                id = { id }
                name = { name }
                onChange = { this.checkValue }
                defaultChecked = { state.checked } 
                value = { name } />
        );
    }
}

export default Checkbox;

Checkbox.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    name: PropTypes.string,
    id: PropTypes.string
};
