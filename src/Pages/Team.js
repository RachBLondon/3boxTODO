import React, { Component } from 'react';
import TODO from './../Components/TODO';
import ModalComponent from './../Components/Modal';
import { Form, Button, Container } from 'react-bootstrap';
import Box from '3box';
import ProfileHover from 'profile-hover';

const moderatorsAddress = '0x2f4cE4f714C68A3fC871d1f543FFC24b9b3c2386';
const members = ['0xab74207ee35fBe1Fb949bdcf676899e9e72Ec530', '0xFF326878D13b33591D286372E67B4AF05cD100bd', '0xbaeBB7d18f8b16B0A970FDa91f1EfA626D67423E', '0x5c44E8982fa3C3239C6E3C5be2cc6663c7C9387E', '0xa8eE0BABE72cD9A80Ae45dD74Cd3eaE7a82fd5d1', '0x5a7246af4fefe777e32399310b50bb7fe2d04f8a']

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

  toggleDone = async (todo) => {
    const post = JSON.stringify({
      text: todo.text,
      completed: !todo.completed,
      show: true,
      order: todo.order,
      postedBy: todo.postedBy
    });
    await this.state.teamThread.post(post);
    await this.state.teamThread.deletePost(todo.id);
    this.getPosts();
  }

  onSubmit = async () => {

    if (this.state.newTodo) {
      const orderNumber = this.state.posts.length > 0 ? (this.state.posts[this.state.posts.length - 1].order + 1) : (1)
      const post = JSON.stringify({
        text: this.state.newTodo,
        completed: false,
        show: true,
        order: orderNumber,
        postedBy: this.props.accounts[0]
      })
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

    const threadName = "teamTodos3";
    let teamThread;
    const isModerator = moderatorsAddress.toLowerCase() === this.props.accounts[0].toLowerCase()
    const moderatorsSpace = await Box.getSpace('0x2f4cE4f714C68A3fC871d1f543FFC24b9b3c2386'.toUpperCase(), "3Notes-test");

    if (moderatorsSpace[threadName]) {
      teamThread = await this.props.space.joinThreadByAddress(moderatorsSpace[threadName]);
    }

    if (!moderatorsSpace[threadName] && isModerator) {
      teamThread = await this.props.space.createConfidentialThread('teamList');
      members.map(async (address) => { await teamThread.addMember(address) });
      await this.props.space.public.set(threadName, teamThread._address);
    }

    if (!moderatorsSpace[threadName] && !isModerator) {
      this.setState({ loginAsModerator: true });
      return;
    }

    await this.setState({ teamThread });
    this.getPosts();
  }

  render() {
    return (
      <div>
        <h2>Team TODOs</h2>
        <p>Team Member</p>
        <div style={{height : '10vh'}}>
          {members.map(address => (<ProfileHover address={address} />))}
          <ProfileHover address={'0x2f4cE4f714C68A3fC871d1f543FFC24b9b3c2386'}/>
        </div>
        <br/>
        <br/>
        {this.state.posts &&
          <TODO
            posts={this.state.posts}
            deletePost={this.deletePost}
            toggleDone={this.toggleDone}
            accounts={this.props.accounts} />
        }
            {!this.state.loginAsModerator && (
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
          <ProfileHover address={moderatorsAddress} />
        </div>}
      </div>
    )
  }
}