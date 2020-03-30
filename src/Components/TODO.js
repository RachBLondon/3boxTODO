import React, { Component } from 'react';
import { Form } from 'react-bootstrap';


export default class TODO extends Component {

    render() {
        return (<div>
            {this.props.posts.map((item, i) => (
                <div 
                    key={i}
                    style={{
                        margin: '10px', borderWidth: '1px',
                        borderBottomColor: 'black',
                        borderStyle: 'solid',
                        padding: '5px',
                        borderRadius: '7px'
                }}>
                    <span style={{margin : '5px'}}>{item.text}</span>
                    <Form.Check 
                        aria-label="option 1" 
                        inline={true} 
                        checked={item.completed} 
                        onChange={this.props.toggleDone.bind(null, item)}/>
                    <i 
                        style={{margin : '5px'}} 
                        className="fa fa-trash" 
                        aria-hidden="true" 
                        onClick={this.props.deletePost.bind(null, item.id)}>
                    </i>
                </div>))}
        </div>)
    }
}