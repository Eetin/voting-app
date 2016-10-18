import React, { Component } from 'react';

import $ from 'jquery';

export default class LogIn extends Component {
    
    constructor(props) {
        super(props);
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
    }
    
    componentDidMount() {
        $('#FacebookBtn').click(function () {
            this.signinWin = window.open("/auth/login/facebook", "SignIn", "width=780, height=410");
            setTimeout(this.checkLoginStatus, 2000);
            this.signinWin.focus();
            return false;
        });
    }
    
    checkLoginStatus() {
        if (!this.signinWin.closed) {
            setTimeout(this.checkLoginStatus, 500);
        }
    }
    
    render() {
        return (
            <div>
                <button id='FacebookBtn' clasName='btn btn-primary'>
                    Log In with Facebook Bla Bla Bla
                </button>
                
            </div>
        );
    }
}