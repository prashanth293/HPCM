/**
 * @author Archana Kumari < arckumar2@publicisgroupie.net >
 * @description A AboutUs component
 * @returns {element}- A AboutUs component including header component
 *         containing one paragraph
 */

import React, { Component, Fragment } from 'react';
import './style.css';
import '../../styles/global.css';
import '../../styles/theme.css';
import label from '../../../public/label.json';
//components
import Footer from '../Footer/';
import Header from '../Header/index';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';

@inject('Store')
@observer
class AboutUs extends Component {
    constructor(props) {
        super(props);
    }
  
    componentWillMount() {
        const {Store} = this.props;
        Store.changeHeader(false, true);
    }
    render() {
        const name =localStorage.getItem('userName');
        document.title = name || label.appTitle;
        return (
            <Fragment>
                <Header
                    title={label.appTitle}
                    username={name}
                    profileInfo={label.profileLabel} />
                <div className="container-fluid cont-header">
                    <div className="px-2 spacing">
                        <h6 className="para-space">{label.aboutUs}</h6>
                        <p className="para-space">
                            {label.aboutUsContent}
                        </p>
                    </div>
                </div>
                <Footer footerText="&copy; Copyright 2018 HPCM" />
            </Fragment>
        );

    }
    
}
AboutUs.propTypes = {
    Store: PropTypes.object
};

export default AboutUs;