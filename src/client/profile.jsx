import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import { isLoggedIn } from './util';

export default class Profile extends Component {
    
    componentWillMount() {
        if (!isLoggedIn()) browserHistory.push('/');
    }
    
    render() {
        const { photo, name, email } = this.props.user;
        return (
            <div className='content profile'>
                <img src={photo} alt='Profile image' />
                <p>Name: {name}</p>
                <p>Email: {email}</p>
                <p><Link to='/logout'>Log Out</Link></p>
            </div>
        );
    }
}