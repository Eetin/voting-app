import React, { Component } from 'react';
import { IndexLink } from 'react-router';

import $ from 'jquery';

import { isLoggedIn } from './util';
import LoggedIn from './loggedin.jsx';
import NotLoggedIn from './notloggedin.jsx';

export default class TopMenu extends Component {
    
    constructor(props) {
        super(props);
        this.updateActiveLinks = this.updateActiveLinks.bind(this);
    }
    
    componentDidMount() {
        this.updateActiveLinks();
    }
    
    componentDidUpdate() {
        this.updateActiveLinks();
    }
    
    updateActiveLinks() {
        // $('.navbar a').map(function(i, el) {
        //     if (window.location.href !== el.href) {
        //         $(el).parent().removeClass('active');
        //     }
        // });
        // $('.navbar a.active').parents().addClass('active');
    }
    
    render() {
        return (
            <nav className='navbar navbar-default navbar-fixed-top'>
                <div className='container-fluid'>
                    <div className='navbar-header'>
                        <IndexLink
                            className='navbar-brand'
                            activeClassName='active'
                            to='/'>YouVote
                        </IndexLink>
                        <button type='button'
                                className='navbar-toggle collapsed'
                                data-toggle='collapse'
                                data-target='#navbar-collapse'
                                aria-expanded='false'> 
                            <span className='sr-only'>Toggle navigation</span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                        </button>
                    </div>
                    <div id='navbar-collapse'
                         className='collapse navbar-collapse'>
                        { isLoggedIn()
                            ? <LoggedIn user={this.props.user} />
                            : <NotLoggedIn />
                        }
                    </div>
                </div>
            </nav>
        );
    }
}