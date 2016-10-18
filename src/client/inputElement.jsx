import React, { Component } from 'react';

export default class InputElement extends Component {
    render() {
        const { id, label, name, placeholder, handler } = this.props;
        return (
            <div className='form-group'>
                { !!label ?
                    <label
                        className='col-sm-2 control-label'
                        htmlFor={id}>
                        {label}
                    </label> : ''
                }
                <div className={ !!label ? 'col-sm-10' : '' }>
                    <input
                        ref='input'
                        className='form-control'
                        id={id}
                        name={name}
                        type='text'
                        placeholder={placeholder}
                        onChange={handler} />
                </div>
            </div>
        );
    }
}