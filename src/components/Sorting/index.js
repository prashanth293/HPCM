/**
* @author Prashanth Reddy <somreddy@publicisgroupe.net>
* @author Amit Raushan <amiraush@publicisgroupe.net>
* @description A table-row component.
* @returns {element} - A Sorting with string params for each cell.
*/
import React, {Component} from 'react';
import '../../styles/theme.css';
import label from '../../../public/label.json';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';

@inject('Store')
@observer
class Sorting extends Component {
    constructor(props) {
        super(props);
        this.handleNameAscend = this
            .handleNameAscend
            .bind(this);
        this.handleNameDescend = this
            .handleNameDescend
            .bind(this);
        this.handleIdAscend = this
            .handleIdAscend
            .bind(this);
        this.handleIdDescend = this
            .handleIdDescend
            .bind(this);
        this.handleStatusHtL = this
            .handleStatusHtL
            .bind(this);
        this.handleStatusLtH = this
            .handleStatusLtH
            .bind(this);
    }

    handleNameAscend() {
        const {Store} = this.props;
        const ascend = Store.sortingMethod === label.nameAscend
            ? ' '
            : label.nameAscend;
        Store.setSortingMethod(ascend);
    }

    handleNameDescend() {
        const {Store} = this.props;
        const descend = Store.sortingMethod === label.nameDescend
            ? ' '
            : label.nameDescend;
        Store.setSortingMethod(descend);
    }

    handleIdAscend() {
        const {Store} = this.props;
        const ascend = Store.sortingMethod === label.idAscend
            ? ' '
            : label.idAscend;
        Store.setSortingMethod(ascend);
    }

    handleIdDescend() {
        const {Store} = this.props;
        const descend = Store.sortingMethod === label.idDescend
            ? ' '
            : label.idDescend;
        Store.setSortingMethod(descend);
    }

    handleStatusHtL() {
        const {Store} = this.props;
        const statusHtL = Store.sortingMethod === label.sortHtL
            ? ' '
            : label.sortHtL;
        Store.setSortingMethod(statusHtL);
    }

    handleStatusLtH() {
        const {Store} = this.props;
        const statusLtH = Store.sortingMethod === label.sortLtH
            ? ' '
            : label.sortLtH;
        Store.setSortingMethod(statusLtH);

    }
    
    render() {
        const {sortingMethod} = this.props.Store;
        return (
            <div className="m-auto">
                <div className="radio">

                    <input
                        type="radio"
                        name="sorting"
                        value="Name Ascending"
                        id="name-ascending"
                        checked={sortingMethod === label.nameAscend}
                        onChange={this.handleNameAscend}/>
                    <label htmlFor="name-ascending" className="login-label-color pointer">
                        {label.nameAscend}
                    </label>
                </div>
                <div className="radio">
                    <input
                        type="radio"
                        name="sorting"
                        value="Name Descending"
                        id="name-Descending"
                        checked={sortingMethod === label.nameDescend}
                        onChange={this.handleNameDescend}/>
                    <label htmlFor="name-Descending" className="login-label-color pointer">
                        {label.nameDescend}
                    </label>
                </div>
                <div className="radio">
                    <input
                        type="radio"
                        name="sorting"
                        value="Id Ascending"
                        id="id-ascending"
                        checked={sortingMethod === label.idAscend}
                        onChange={this.handleIdAscend}/>
                    <label htmlFor="id-ascending" className="login-label-color pointer">
                        {label.idAscend}
                    </label>
                </div>
                <div className="radio">

                    <input
                        type="radio"
                        name="sorting"
                        value="Id Descending"
                        id="id-Descending"
                        checked={sortingMethod === label.idDescend}
                        onChange={this.handleIdDescend}/>
                    <label htmlFor="id-Descending" className="login-label-color pointer">
                        {label.idDescend}
                    </label>
                </div>
                <div className="radio">

                    <input
                        type="radio"
                        name="sorting"
                        value="Status high to low"
                        id="status-ascending"
                        checked={sortingMethod === label.sortHtL}
                        onChange={this.handleStatusHtL}/>
                    <label htmlFor="status-ascending" className="login-label-color pointer">
                        {label.sortHtL}
                    </label>
                </div>
                <div className="radio">

                    <input
                        type="radio"
                        name="sorting"
                        value="Status low to high"
                        id="status-Descending"
                        checked={sortingMethod === label.sortLtH}
                        onChange={this.handleStatusLtH}/>
                    <label htmlFor="status-Descending" className="login-label-color pointer">
                        {label.sortLtH}
                    </label>
                </div>
            </div>
        );

    }

}
Sorting.propTypes = {
    Store: PropTypes.object
};
export default Sorting;
