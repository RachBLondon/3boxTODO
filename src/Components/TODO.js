import React, { Component } from 'react';

const todos = [{ text: 'fed cat', completed: false, show: true }, { text: 'pay tax', completed: true, show: true }, { text: 'laundry', completed: false, show: true }]

export default class TODO extends Component {
    render() {
        return (<div>
            {todos.map((item) => (
                <div style={{
                    margin: '10px', borderWidth: '1px',
                    borderBottomColor: 'black',
                    borderStyle: 'solid',
                    padding: '5px',
                    borderRadius: '7px'
                }}>
                    <span style={{margin : '5px'}}>{item.text}</span>
                    <input style={{margin : '5px'}} type="checkbox" />
                    <i style={{margin : '5px'}} className="fa fa-trash" aria-hidden="true"></i>
                </div>))}
        </div>)
    }
}