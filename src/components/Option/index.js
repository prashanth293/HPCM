/**
* @author Prashanth Reddy <somreddy@publicisgroupe.net>
* @description A select component.
* @param { string } props - select input attributes.
* @returns { element } - A select element which has props passed as string as its attributes
*/

import React from 'react';
import { PropTypes } from 'prop-types';

const Options = (props) => {
    return (
        <option className="hoverEffect" value={props.value}>{props.child}</option>
    );
};

export default Options;

Options.propTypes= {
    value: PropTypes.string,
    child: PropTypes.string
};
