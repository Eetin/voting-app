import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { render } from 'react-dom';

import { isLoggedIn, getProfile, logOut } from './util';

import TopMenu from './topmenu.jsx';
import Home from './home.jsx';
import Profile from './profile.jsx';
import Poll from './poll.jsx';
import MyPolls from './mypolls.jsx';
import NewPoll from './newpoll.jsx';
import LogIn from './logIn.jsx';
import LogOut from './logOut.jsx';
import LoginSuccess from './loginSuccess.jsx';
import NotFound from './notFound.jsx';


class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            user: {
                photo: '',
                name: '',
                email: ''
            }
        };
        this.updateProfile = this.updateProfile.bind(this);
    }
    
    componentWillMount() {
        if (isLoggedIn && this.state.user.name === '') {
            this.updateProfile();
        }
    }
    
    componentWillUpdate() {
        if (isLoggedIn && this.state.user.name === '') {
            this.updateProfile();
        }
    }
    
    updateProfile() {
        if (isLoggedIn) {
            getProfile(user => {
                if (!!user.error) {
                    console.error('user error');
                    return logOut();
                }
                this.setState({ user: user });
            });
        } else if (!isLoggedIn) {
            this.setState({
                user: {
                    photo: '',
                    name: '',
                    email: ''
                }
            });
        }
    }
    
    render() {
        return (
            <div>
                <TopMenu user={this.state.user} />
                <div className='container'>
                    {React.cloneElement(this.props.children, this.state)}
                </div>
            </div>
        );
    }
}

render((
    <Router history={browserHistory}>
      <Route path='/login_success' component={LoginSuccess} />
      <Route path='/' component={App}>
        <IndexRoute component={Home} />
        <Route path='/login' component={LogIn} />
        <Route path='/logout' component={LogOut} />
        <Route path='/my/profile' component={Profile} />
        <Route path='/poll/:pollId' component={Poll} />
        <Route path='/my/polls' component={MyPolls} />
        <Route path='/my/polls/new' component={NewPoll} />
        <Route path='*' component={NotFound} />
      </Route>
    </Router>
), document.getElementById('app'));
