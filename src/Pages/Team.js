import React, { Component } from 'react';
import TODO from './../Components/TODO';
import ModalComponent from './../Components/Modal';
import { Form, Button, Container } from 'react-bootstrap';
import Box from '3box';
import ProfileHover from 'profile-hover';

const moderatorsAddress = '0x2f4cE4f714C68A3fC871d1f543FFC24b9b3c2386';

export default class Team extends Component {
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
    const post = JSON.stringify({ text: todo.text, completed: !todo.completed, show: true, order : todo.order });
    await this.state.teamThread.post(post);
    await this.state.teamThread.deletePost(todo.id);
    this.getPosts();
  }

  onSubmit = async () => {

    if (this.state.newTodo) {
      const orderNumber = this.state.posts.length > 0 ? (this.state.posts[this.state.posts.length - 1].order + 1 ): (1)
      const post = JSON.stringify({ text: this.state.newTodo, completed: false, show: true, order : orderNumber })
      await this.state.teamThread.post(post)
      this.setState({ newTodo: null });
      this.getPosts();
    }
  }

  async getPosts() {
    const rawPosts = await this.state.teamThread.getPosts();
    const posts = this.parsePosts(rawPosts);
    this.setState({ posts });
  }

  deletePost = async (postId) => {
    await this.state.teamThread.deletePost(postId);
    await this.getPosts();
  }
  async componentDidMount() {
    
    const threadName = "teamTodos2";
    let teamThread;
    const isModerator = moderatorsAddress.toLowerCase() === this.props.accounts[0].toLowerCase()
    const moderatorsSpace = await Box.getSpace('0x2f4cE4f714C68A3fC871d1f543FFC24b9b3c2386'.toUpperCase(), "3Notes-test");
    
    if(moderatorsSpace[threadName]){
      teamThread = await this.props.space.joinThreadByAddress(moderatorsSpace[threadName]);
    }

    if (!moderatorsSpace[threadName] && isModerator) {
      teamThread = await this.props.space.createConfidentialThread('teamList');
      await teamThread.addMember('0xab74207ee35fBe1Fb949bdcf676899e9e72Ec530');
      await this.props.space.public.set(threadName, teamThread._address);
    }
    
    if(!moderatorsSpace[threadName] && !isModerator){
      this.setState({loginAsModerator :true});
      return;
    }


    console.log("teamThread", teamThread)
    await this.setState({ teamThread });
    this.getPosts();
  }

  render() {
    return (
      <div>
        <h2>Team TODOs</h2>
        {this.state.posts &&
          <TODO posts={this.state.posts} deletePost={this.deletePost} toggleDone={this.toggleDone} />
        }
        { !this.state.loginAsModerator && (
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
        </ModalComponent>)}
        {this.state.loginAsModerator && <div>
          <p>👇 Request the moderator to login to create the todo list </p>
          <ProfileHover address={moderatorsAddress}/>
        </div>}
      </div>
    )
  }
}