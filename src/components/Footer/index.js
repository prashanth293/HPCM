/**
* @author Saumya Shree <saushree@publicisgroupe.net>
* @description A Footer function
* @param - props
* @returns { element } - A Footer element
*/

import React from 'react';
import { PropTypes } from 'prop-types';
import './index.css';

const Footer = ( props ) => {
    return (

        <footer className="footer footer-style">
            <div className="container ml-0">
                <span className="text-muted">{ props.footerText }</span>
            </div>
        </footer>
    );
};
    
Footer.propTypes = {
    footerText: PropTypes.string
};
export default Footer;