/**
 * @author Ritesh Kumar <ritkumar2@publicisgroupie.net>
 * @description A side navigation component
 * @returns {element}- A navigation component including app-logo, 
                       and varous links active and disabled.     
 */
import React from 'react';
import { PropTypes } from 'prop-types';
import {Link} from 'react-router-dom';
import './style.css';
import '../../styles/theme.css';
import image from '../../assets/images/hpcm-logo2.png';
import label from '../../../public/label.json';

const Sidenav = (props) => {
    return (
        <div
            id='sideNavigation'
            className='sidenav header-color d-flex flex-column'>
            <Link to = '/dashboard'>
                <img className='app-logo' src={image} alt = {label.appTitle} ></img>
            </Link>
            <div className='d-flex align-items-start flex-column top-links section-color'>
                <Link to= './nomineelist' className="link-default-color">{props.panel}</Link>
                <a href='#' className='btn btn-link disabled link-color'>{props.calender}</a>
                <a href='#' className='btn btn-link disabled'>{props.hiring}</a>
                <a href='#' className='btn btn-link disabled'>{props.reporting}</a>
            </div>
            <div className='d-flex align-items-start flex-column bottom-links my-auto'>
                <a href='#' className='d-sm-block d-md-none btn btn-link link-default-color disabled'>{props.profileInfo}</a>
                <Link to='/aboutus' className='d-block link-default-color link-margin'>{props.aboutUs}</Link>
                <Link to = '/help' className='d-block link-default-color'>{props.help}</Link>
                <Link to='/logout' className='d-sm-block d-md-none link-default-color'>{label.lgutLabel}</Link>
            </div>
        </div>
    );
};

export default Sidenav;

Sidenav.propTypes = {
    panel: PropTypes.string,
    calender: PropTypes.string,
    hiring: PropTypes.string,
    reporting: PropTypes.string,
    profileInfo: PropTypes.string,
    aboutUs: PropTypes.string,
    help: PropTypes.string,
    logout: PropTypes.string
};