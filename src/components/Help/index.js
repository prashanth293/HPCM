/**
 * @author Archana Kumari < arckumar2@publicisgroupie.net >
 * @description A Help component
 * @returns {element}- A help[] component including header component
 *         containing one paragraph
 */

import React, { Component, Fragment } from 'react';
import './style.css';
import '../../styles/global.css';
import '../../styles/theme.css';
import label from '../../../public/label.json';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
//components
import Footer from '../Footer/';
import Header from '../Header/';

@inject('Store')
@observer
class Help extends Component {
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
                        <h6 className="para-space">{label.anyHelp}</h6>
                        <div className="d-inline-block para-space">
                            <h6>View all Microsoft products</h6>
                            <p>
                                {label.helpPageContent}
                            </p>
                            <h6 className="para-space">Contact Us</h6>
                            <div>
                                <p>
                                    {label.helpContactNAmerica} 
                                </p>
                                <p>
                                    {label.helpContactInternational}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer footerText="&copy; Copyright 2018 HPCM" />
            </Fragment>
        );

    }
}
Help.propTypes = {
    Store: PropTypes.object
};


export default Help;