import React from 'react';
import PropTypes from 'prop-types';
import history from 'app/routes/history';

const NoInternet = ({ btnTitle, content }) => {
    const refreshPage = () => {
        const getStatusOnline = window.navigator.onLine;
        const { pathname } = history.location;
        getStatusOnline && window.location.assign(pathname);
    };

    return (
        <div className="no-conn-internet">
            <p>{content}</p>
            <button onClick={refreshPage}>{btnTitle}</button>
        </div>
    );
};

NoInternet.defaultProps = {
    btnTitle: "Can't load this page. check your internet connection and try again",
    content: 'Retry',
};

NoInternet.propTypes = {
    btnTitle: PropTypes.string,
    content: PropTypes.string,
};

export default NoInternet;
