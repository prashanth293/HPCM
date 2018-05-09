/**
* @author Saumya Shree <saushree@publicisgroupe.net>
* @description A Modal component.
* @param { string } - heading, modal content as props children and button text.
* @returns { element } - A div conatiner which is a modal
*/

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import '../../styles/theme.css';
import './index.css';

class Modal extends Component  {
    constructor ( props ) {
        super ( props );
    }

    render() {

        return (
            <div>
                { (this.props.display) ? 
                    <div className = "modal flex-container hpcm-modal" role = "dialog">
                        <div className = "modal-dialog modal-dialog-centered" role = "document">
                            <div className = "modal-wrapper modal-content flex-container">
                                <h5 className = "heading">
                                    { this.props.modalHeading }
                                </h5>        
                                <div className = "modal-body flex-container">
                                    { this.props.children }
                                </div>
                            </div>
                        </div>
                    </div> : null}
            </div>
        );
    }
}

export default Modal;

Modal.propTypes = {
    display: PropTypes.bool,
    children: PropTypes.element,
    modalHeading: PropTypes.string
};