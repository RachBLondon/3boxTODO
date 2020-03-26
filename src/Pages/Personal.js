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
    console.log("in parsePosts", postArr)
    return postArr.map((rawPost) => {
      console.log("rawPost", rawPost)
      let post = JSON.parse(rawPost.message);
      post.id = rawPost.postId;
      return post;
    });
  }

  // async onSubmit (){
  //   if(this.state.newTodo){
  //     await this.state.personList.post(this.state.newTodo)
  //     console.log("posted", this.state.newTodo)
  //     this.setState({newTodo : null});
  //     this.getPosts();
  //   }
  // }

  async getPosts(){
    const rawPosts = await this.state.personalThread.getPosts();
    console.log("this getPosts", this);
    console.log("rawPosts", rawPosts);
    const posts = this.parsePosts(rawPosts);
    console.log("posts", posts);
    this.setState({ posts });
  }

  async componentDidMount() {
    const personalListAddress = await this.props.space.private.get("personalListAddress");
    const post = JSON.stringify({ text: 'fed cat' + Date.now(), completed: false, show: true })
    let personalThread
    if(personalListAddress){
      console.log("personalListAddress", personalListAddress)
      // .joinThreadByAddress
      personalThread = await this.props.space.joinThreadByAddress(personalListAddress);
      console.log("already has a personal thread ", personalThread)
    }
    if(!personalListAddress){
       personalThread = await this.props.space.createConfidentialThread('personalList');
       await this.props.space.private.set('personalListAddress', personalThread._address);
       console.log("new perosnal list", personalThread);
    }
    console.log("just before set State", personalThread)
    await this.setState({personalThread});
    const posts1 = await this.state.personalThread.getPosts();
    console.log("posts1", posts1)
    await this.state.personalThread.post(post);
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
            ModalBodyText={"One more thing on the list."} >

          <Container>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>New Item</Form.Label>
                <Form.Control type="text" value={this.state.newTodo} onChange={(e)=>(this.setState({newTodo : e.target.value}))} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            </Container>   
          </ModalComponent>
      </div>
    )
  }
}