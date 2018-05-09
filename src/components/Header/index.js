/**
 * @author Ritesh Kumar <ritkumar2@publicisgroupie.net>
           Archana Kumari <arckumar2@publicisgroupie.net>
 * @description A header component
 * @returns {element}- A header component including menu-icon, 
                       profile-logo on which dropdown hover effect
                       is shown and ReactCSSTransitionGroup which
                       contains app hiring-links.     
 */
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Link} from 'react-router-dom';
import MaterialIcon from 'react-google-material-icons';
//styles
import './style.css';
import '../../styles/theme.css';
//components
import Sidenav from '../Sidenav/';
import label from '../../../public/label.json';
import { inject, observer } from 'mobx-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import image from '../../assets/images/profile-icon.png';

@inject('Store')
@observer
class Header extends Component {
    constructor(props) {
        super(props);
        this.changeNav = this.changeNav.bind(this);
    }

    /**
    * @description show or hide the sidenav component on clicking sidenav handler
    */
    changeNav() {
        const { Store } = this.props,
            { isHidden, icon } = Store.header;
        Store.changeHeader(!isHidden, !icon);
    }
    
    render() {
        const { Store, title, username, profileInfo } = this.props;
        return (
            <div>
                <div className='d-flex col-12 header header-color'>
                    <div className='icon-wrapper pl-2'>
                        <div>
                            {Store.header.icon ? (
                                <div className='icon' onClick={this.changeNav}>
                                    <MaterialIcon icon='menu' size={36} />
                                </div>
                            ) : (
                                <div className='icon' onClick={this.changeNav}>
                                    <MaterialIcon icon='close' size={36} />
                                </div>
                            )}
                        </div>
                        <div className='header-title pl-2'>
                            <Link to = '/dashboard'>
                                <span className='link-default-color'><b>{title}</b></span>
                            </Link>
                        </div>
                    </div>
                    <div className='dropdown ml-auto d-none d-md-block'>
                        <div className='dropbtn'>
                            <span className='pl-2'>
                                <img className='profile-img' src={image} alt='label.profileImage' />
                            </span>
                            <div className='user-name align-middle p-2'>
                                <span>{username}</span>
                            </div>
                            <div className='dropdown-content'>
                                <a href='#' className='btn btn-link  disabled text-left'>{profileInfo}</a>
                                <Link to='/logout' className="link-default-color">{label.lgutLabel}</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <ReactCSSTransitionGroup
                    transitionName='example'
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                    {Store.header.isHidden && (
                        Sidenav({panel: 'Panel Management', calender: 'Calender Setup',
                            hiring: 'Hiring Tool', reporting: 'Reporting', profileInfo: 'Profile Info',
                            aboutUs: 'About Us', help: 'Help', logout: 'Logout'})
                    )}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export default Header;

Header.propTypes = {
    Store: PropTypes.object,
    title: PropTypes.string,
    username: PropTypes.string,
    profileInfo: PropTypes.string,
    logout: PropTypes.string
};
