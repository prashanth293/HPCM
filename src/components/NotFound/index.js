/**
* @author Amit Raushan <amiraush@publicis@groupe.net>
* @description NotFound component.
* @param {string} props - location of the route
* @returns {element} - an element with HTMl node not found
*/
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const NotFound = ( { location } ) => ( 
    <Fragment>
        <div className = "container-fluid d-flex align-items-center justify-content-center">
            <h3>Whoops, could not be found {location.pathname}</h3> 
        </div>
    </Fragment>
);

NotFound.propTypes = {
    location: PropTypes
        .shape( {pathname: PropTypes.string.isRequired})
        .isRequired
};
export default NotFound;