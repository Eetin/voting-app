import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { isLoggedIn, createPoll } from './util';
import InputElement from './inputElement.jsx';

class PollForm extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            options: ['', ''],
            submitDisabled: true
        };
        this.handleOptionsChange = this.handleOptionsChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleNewOption = this.handleNewOption.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validate = this.validate.bind(this);
    }
    
    componentWillMount() {
        if (!isLoggedIn()) browserHistory.push('/');
    }
    
    componentWillUpdate(nextProps, nextState) {
        this.validate(nextState);
    }
    
    handleTitleChange(e) {
        this.setState({ title: e.target.value });
    }
    
    handleOptionsChange(e) {
        let stateChange = {};
        const option = +(this.refs[e.target.name]
            .refs.input
            .name
            .split('-')[1]);
        stateChange.options = [...this.state.options];
        stateChange.options[option] = e.target.value.trim();
        this.setState(stateChange);
    }
    
    handleNewOption(e) {
        let stateChange = {};
        stateChange.options = [...this.state.options];
        stateChange.options.push('');
        this.setState(stateChange);
    }
    
    handleSubmit(e) {
        e.preventDefault();
        createPoll({
            title: this.state.title,
            options: this.state.options.filter(option => option !== '')
        }, data => {
            console.log(data);
            if (!data.error) browserHistory.push(`/poll/${data._id}`);
            else console.error(data.error);
        });
    }
    
    validate(nextState) {
        let titlePresent = nextState.title !== '';
        let optionsPresent = nextState.options
            .filter(option => option !== '').length >= 2;
        let submitDisabled = !titlePresent || !optionsPresent;
        if (nextState.submitDisabled !== submitDisabled) {
            this.setState({ submitDisabled });
        }
    }
    
    render() {
        return (
            <form className='poll-form form-horizontal'>
                <InputElement
                    key='titleInput'
                    ref='title'
                    id='titleInput'
                    label='Poll Title'
                    name='title'
                    placeholder='Poll Title'
                    handler={this.handleTitleChange} />
                {
                    this.state.options.map((value, i) => {
                        return (
                            <InputElement
                                key={`option-${i}`}
                                ref={`option-${i}`}
                                id={`option-${i}`}
                                label={`Option ${i+1}`}
                                name={`option-${i}`}
                                placeholder={`Option ${i+1}`}
                                handler={this.handleOptionsChange} />
                        );
                    })
                }
                <div className='text-center'>
                    <input
                        className='btn btn-primary'
                        type='button'
                        value='Add new option'
                        onClick={this.handleNewOption} />
                    <input
                        ref='submit'
                        className='btn btn-success'
                        type ='submit'
                        value='Create Poll'
                        disabled={this.state.submitDisabled}
                        onClick={this.handleSubmit} />
                </div>
            </form>
        );
    }
    
}

export default class NewPoll extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            options: []
        };
    }
    
    
    
    render() {
        return (
            <div className='content new-poll'>
                <h1 className='text-center'>New poll</h1>
                <PollForm />
            </div>
        );
    }
}