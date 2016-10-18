import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { logOut } from './util';

export default class LogOut extends Component {
    componentWillMount() {
        logOut();
        browserHistory.push('/');
    }
    
    render() {
        return null;
    }
}