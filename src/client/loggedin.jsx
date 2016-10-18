import React, { Component } from 'react';
import { Link } from 'react-router';

export default class LoggedIn extends Component {
    
    render() {
        const { user } = this.props
        return (
            <ul className='nav navbar-nav navbar-right'>
                <li>
                    <Link
                        className='navbar-link'
                        activeClassName='active'
                        to='/my/polls'>My polls
                    </Link>
                </li>
                <li>
                    <Link
                        className='navbar-link'
                        activeClassName='active'
                        to='/my/polls/new'>New poll
                    </Link>
                </li>
                <li>
                    <Link
                        className='navbar-link'
                        activeClassName='active'
                        to='/my/profile'>{ !!user ? user.name : '' }
                    </Link>
                </li>
            </ul>
        );
    }
}