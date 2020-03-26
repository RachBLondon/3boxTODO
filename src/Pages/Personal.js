import React, { Component } from 'react';
import TODO from './../Components/TODO';
import ModalComponent from './../Components/Modal';
import { Form, Button, Container } from 'react-bootstrap';






export default class Personal extends Component {
  state = {
    posts : null, 
    newTodo : null
  }
  
  parsePosts = (postArr) => {
    return postArr.map((rawPost) => {
      let post = JSON.parse(rawPost.message);
      post.id = rawPost.postId;
      return post;
    });
  }

   onSubmit = async()=>{

    if(this.state.newTodo){
      const post = JSON.stringify({ text: this.state.newTodo, completed: false, show: true })
      console.log("Post", post)
      await this.state.personalThread.post(post)
      console.log("posted", this.state.newTodo)
      this.setState({newTodo : null});
      this.getPosts();
    }
  }

  async getPosts(){
    const rawPosts = await this.state.personalThread.getPosts();
    const posts = this.parsePosts(rawPosts);
    this.setState({ posts });
  }

  async componentDidMount() {
    const personalListAddress = await this.props.space.private.get("personalListAddress");
    // const post = JSON.stringify({ text: 'fed cat' + Date.now(), completed: false, show: true })
    let personalThread
    if(personalListAddress){
      personalThread = await this.props.space.joinThreadByAddress(personalListAddress);
    }
    if(!personalListAddress){
       personalThread = await this.props.space.createConfidentialThread('personalList');
       await this.props.space.private.set('personalListAddress', personalThread._address);
    }
    await this.setState({personalThread});
    const posts1 = await this.state.personalThread.getPosts();
    this.getPosts();
  }

  render() {
    return (
      <div>
        <h2>Personal TODOs</h2>
        {this.state.posts &&
          <TODO posts={this.state.posts} />
          }
          <ModalComponent 
            buttonText={"Add a ToDo"}
            ModalHeader={"Add a Todo"}
            ModalBodyText={"One more thing on the list."}
            submitFunc={this.onSubmit} >

          <Container>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>New Item</Form.Label>
                <Form.Control type="text" value={this.state.newTodo} onChange={(e)=>(this.setState({newTodo : e.target.value}))} />
              </Form.Group>
              {/* <Button variant="primary" type="submit" onClick={this.submit}>
                Submit
              </Button> */}
            </Form>
            </Container>   
          </ModalComponent>
      </div>
    )
  }
}