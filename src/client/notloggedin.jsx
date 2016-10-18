import React, { Component } from 'react';
import { browserHistory } from 'react-router';

export default class NotLoggedIn extends Component {
    
    constructor(props) {
        super(props);
        this.handleFacebookLogIn = this.handleFacebookLogIn.bind(this);
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
    }
    
    handleFacebookLogIn() {
        // event.preventDefault();
        this.signinWin = window.open("/auth/login/facebook", "SignIn", "width=780,height=410");
        setTimeout(this.checkLoginStatus, 500);
        this.signinWin.focus();
    }
    
    checkLoginStatus() {
        if (this.signinWin.closed) {
            browserHistory.push(window.location.pathname);
        }
        else setTimeout(this.checkLoginStatus, 500);
    }
    
    render() {
        return (
            <ul className='nav navbar-nav navbar-right social'>
                <li>
                    <a  className='btn btn-block btn-social btn-facebook'
                        href="#"
                        onClick={this.handleFacebookLogIn}>
                        <span className="fa fa-facebook"></span> Log in with Facebook
                    </a>
                </li>
            </ul>
        );
    }
}