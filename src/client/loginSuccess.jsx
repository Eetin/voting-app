import React, { Component } from 'react';

export default class LoginSuccess extends Component {
    
    componentWillMount() {
        window.localStorage.setItem('authenticated',
            this.props.location.query.authenticated);
        window.close();
    }
    
    render() {
        return null;
    }
}