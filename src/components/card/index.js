/**
 * @author Ritesh Kumar <ritkumar2@publicisgroupie.net>
           Archana Kumari <arckumar2@publicisgroupie.net>
 * @description A Dashboard component
 * @returns {element}- A Card component including card-title and card-text.     
 */

import React from 'react';
import { PropTypes } from 'prop-types';
import './style.css';
import '../../styles/theme.css';

const Card = (props) => {
    const {className, content, title } = props;
    return (
        <div className={`card card-color card-design card-link list-group-item ${ className }`}>
            <div className='card-block'>
                <div className='card-title'>
                    <h5>{title}</h5>
                </div>
                <div className='card-text link-style'>
                    <p>{content}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Card;

Card.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string
};