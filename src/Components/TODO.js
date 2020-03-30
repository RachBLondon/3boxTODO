import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import ProfileHover from 'profile-hover';


export default class TODO extends Component {

    render() {
        const sortedArray = this.props.posts.sort((a, b) => (a.order - b.order));

        return (<div>
            {sortedArray.map((item, int) => {
            const isOwner = item.postedBy === this.props.accounts[0];
            console.log("isOwner", isOwner)
            return (
                <div
                    key={int}
                    style={{
                        margin: '10px', borderWidth: '1px',
                        height: '60px',
                        borderBottomColor: 'black',
                        borderStyle: 'solid',
                        padding: '5px',
                        borderRadius: '7px',
                        lineHeight: '48px'
                    }}>
                  
                    <span style={{ margin: '5px' }}>{item.text}</span>
                    <Form.Check
                        aria-label="option 1"
                        inline={true}
                        checked={item.completed}
                        disabled={!isOwner}
                        onChange={this.props.toggleDone.bind(null, item)} />
            
                    <span role="img" onClick={isOwner ? this.props.deletePost.bind(null, item.id): ()=>(console.log)}>🗑</span>
                    {item.postedBy && <ProfileHover address={item.postedBy} />}
                </div>)
            })}
        </div>)
    }
}