import React, { Component } from 'react';
import TODO from './../Components/TODO';
import ModalComponent from './../Components/Modal';
import { Form, Button, Container } from 'react-bootstrap';


export default class Personal extends Component {
  state = {
    posts: null,
    newTodo: ""
  }

  parsePosts = (postArr) => {
    return postArr.map((rawPost) => {
      let post = JSON.parse(rawPost.message);
      post.id = rawPost.postId;
      return post;
    });
  }

  toggleDone = async(todo)=> {
    const post = JSON.stringify({ text: todo.text, completed: !todo.completed, show: true, order : todo.order, postedBy: todo.postedBy });
    await this.state.personalThread.post(post);
    await this.state.personalThread.deletePost(todo.id);
    this.getPosts();
  }

  onSubmit = async () => {

    if (this.state.newTodo) {
      const orderNumber = this.state.posts.length > 0 ? (this.state.posts[this.state.posts.length - 1].order + 1 ): (1)
      const post = JSON.stringify({ text: this.state.newTodo, completed: false, show: true, order : orderNumber, postedBy: this.props.accounts[0]})
      await this.state.personalThread.post(post)
      this.setState({ newTodo: null });
      this.getPosts();
    }
  }

  async getPosts() {
    const rawPosts = await this.state.personalThread.getPosts();
    const posts = this.parsePosts(rawPosts);
    this.setState({ posts });
  }

  deletePost = async (postId) => {
    await this.state.personalThread.deletePost(postId);
    await this.getPosts();
  }
  async componentDidMount() {
    
    const threadName = "personalListAddress8";
    const personalListAddress = await this.props.space.private.get(threadName);
    let personalThread
    if (personalListAddress) {
      personalThread = await this.props.space.joinThreadByAddress(personalListAddress);
    }
    if (!personalListAddress) {
      personalThread = await this.props.space.createConfidentialThread('personalList');
      await this.props.space.private.set(threadName, personalThread._address);
    }
    await this.setState({ personalThread });
    this.getPosts();
  }

  render() {
    return (
      <div>
        <h2>Personal TODOs</h2>
        {this.state.posts &&
          <TODO 
              posts={this.state.posts} 
              deletePost={this.deletePost}
              toggleDone={this.toggleDone}
              accounts={this.props.accounts} />
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
                <Form.Control
                  type="text"
                  value={this.state.newTodo}
                  onChange={(e) => (this.setState({ newTodo: e.target.value }))}
                />
              </Form.Group>
            </Form>
          </Container>
        </ModalComponent>
      </div>
    )
  }
}