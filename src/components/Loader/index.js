/**
* @author Prashanth Reddy <somreddy@publicisgroupe.net>
* @description A loader function
* @param - props
* @returns { element } - A loader element
*/

import React from 'react';
import { PropTypes } from 'prop-types';

const Loader = ( props ) => {
    return (
        <div className={props.loaderWrapper}>
            <div className={props.loader}></div>
        </div>
        
    );
};
    
Loader.propTypes = {
    loaderWrapper: PropTypes.string,
    loader: PropTypes.string
    
};
export default Loader;