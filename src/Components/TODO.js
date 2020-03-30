import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import ProfileHover from 'profile-hover';


export default class TODO extends Component {
    
    render() {
        const sortedArray = this.props.posts.sort( (a, b)=> ( a.order - b.order));

        return (<div>
            {sortedArray.map((item, i) => (
                <div 
                key={i}
                style={{
                    margin: '10px', borderWidth: '1px',
                    height : '60px',
                    borderBottomColor: 'black',
                    borderStyle: 'solid',
                    padding: '5px',
                    borderRadius: '7px',
                    lineHeight: '48px'
                }}>
                    {item.postedBy && <ProfileHover address={item.postedBy} />}
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
                    {/* {item.postedBy && <span>{ item.postedBy}</span>} */}

                </div>))}
        </div>)
    }
}