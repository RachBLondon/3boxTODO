import React, { Component } from 'react';
import TODO from './../Components/TODO';
import ModalComponent from './../Components/Modal';
import { Form, Button, Container } from 'react-bootstrap';
import Box from '3box';
import ProfileHover from 'profile-hover';

const members = ['0xab74207ee35fBe1Fb949bdcf676899e9e72Ec530', '0xFF326878D13b33591D286372E67B4AF05cD100bd', '0xbaeBB7d18f8b16B0A970FDa91f1EfA626D67423E', '0x5c44E8982fa3C3239C6E3C5be2cc6663c7C9387E', '0xa8eE0BABE72cD9A80Ae45dD74Cd3eaE7a82fd5d1', '0x5a7246af4fefe777e32399310b50bb7fe2d04f8a', '0x18B14A7d061B504C75C7027738d16dcED739b2E9']
const moderatorsAddress = '0x2f4cE4f714C68A3fC871d1f543FFC24b9b3c2386';

export default class Team extends Component {
  state = {
    posts: [],
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
    // if moderator logs in, they create the confidential thread
    //confidentialThreadaddress is saved in moderators public space
    // members who are hard coded in the team need to open 
    // the space so they can be added by the moderator
    // team members which have opened the space are saved  
    // in a 'waiting room' post on a public thread
    // when the moderator logs in they add all the users  
    // in the 'waiting room' and delete
    // then if team members have been added they can join

    const addresses = [
          '0xab74207ee35fBe1Fb949bdcf676899e9e72Ec530', 
          '0xFF326878D13b33591D286372E67B4AF05cD100bd', 
          '0xbaeBB7d18f8b16B0A970FDa91f1EfA626D67423E', 
          '0x5c44E8982fa3C3239C6E3C5be2cc6663c7C9387E', 
          '0xa8eE0BABE72cD9A80Ae45dD74Cd3eaE7a82fd5d1', 
          '0x5a7246af4fefe777e32399310b50bb7fe2d04f8a', 
          '0x18B14A7d061B504C75C7027738d16dcED739b2E9', 
          '0x5031f308AD02Ed86F44c586aD2B01ae55D034C7a',
          '0xB3B30f49384093eE32d26C2C8E38e6566482C6a8'
        ];

    const teamMembers = addresses.map(member => member.toLowerCase());
    const spaceName =  "3Notes-test";

    //TODO save a global const
    const confidentialThreadName = "confidential-todos";
    const waitingRoomName = "waitingroom6";
    let teamThread;
    const isModerator = moderatorsAddress.toLowerCase() === this.props.accounts[0].toLowerCase();
    const moderatorsSpace = await Box.getSpace(moderatorsAddress.toUpperCase(), spaceName);
    console.log("Moderators space", moderatorsSpace)

    const isTeamMember = teamMembers.includes(this.props.accounts[0]);
    console.log(teamMembers[0] == this.props.accounts[0], teamMembers[0], this.props.accounts[0])
    if(!isModerator && !isTeamMember){
      //TODO handle in UI
      this.setState({notAModOrTeam : true});
    }
    
    if (!moderatorsSpace[confidentialThreadName] && isModerator) {
      // if theconfidentialThreadname is not saved in the moderators space
      // it means it theconfidentialThreadhas not been created yet. 
      // create the confidentialconfidentialThreadand save the address in 
      // the moderators public space
      const confidentialThread = await this.props.space.createConfidentialThread(confidentialThreadName);
      await this.props.space.public.set(confidentialThreadName, confidentialThread.address);
      const waitingRoom = await this.props.space.joinThread(waitingRoomName);
      await this.props.space.public.set(waitingRoomName, waitingRoom.address);
      console.log("confidential thread and waiting room thread made");
    }

    if (!moderatorsSpace[confidentialThreadName] && !isModerator) {
      // TODO handle in the UI
      // create an element to indicate the moderator needs to login to create
      this.setState({moderatorNeedsToCreateThread : true});
    }
    if (moderatorsSpace[confidentialThreadName]) {
      // This means the confidentialconfidentialThreadhas been created and the address  
      // added to the moderators public space

      if(isTeamMember && !isModerator){
        // if first time in app mark that the user has opened a space in publicconfidentialThread
        // We also need to record the users which have been added to the thread
        // in the publicconfidentialThreadso they can open the confidential thread
        console.log('moderatorsSpace[waitingRoomName]',moderatorsSpace[waitingRoomName]);
        const waitingRoom = await this.props.space.joinThreadByAddress(moderatorsSpace[waitingRoomName]);
        const rawPosts = await waitingRoom.getPosts();

        // if there are no posts in waiting room thread, it means no one has joined the space
        if(rawPosts.length < 1){
          await waitingRoom.post(JSON.stringify({waitingRoom : [this.props.accounts[0]], added : []}));
          this.setState({moderatorWillAdd : true});
        } else {
          const mostRecent = JSON.parse(rawPosts[rawPosts.length -1].message);
          // check if the user has already been added to the confidential thread
          if(mostRecent.added.includes(this.props.accounts[0])){
            console.log("has been added to the confidential thread");
            // joinconfidentialThreadvia the address
            const confidentialThread= await this.props.space.joinThreadByAddress(moderatorsSpace[confidentialThreadName]);
            console.log("joinedconfidentialThreadas team");
            // const posts = await confidentialThread.getPosts();
            // console.log('posts', posts);
            this.setState({teamThread : confidentialThread});
            this.getPosts();

          } else {
            // add user to waiting room in prep to be added to confidential thread
            console.log("adding user to waiting room")
            mostRecent.waitingRoom.push(this.props.accounts[0]);
            await waitingRoom.post(JSON.stringify(mostRecent));
            // await waitingRoom.deletePost(rawPosts[rawPosts.length -1].postId);
            this.setState({moderatorWillAdd : true});
          }

        }
      }
      if(isModerator){
        // moderator should join the space and add users in waiting 
        // room users in waiting room then moved to added array
        const confidentialThread= await this.props.space.joinThreadByAddress(moderatorsSpace[confidentialThreadName]);
        console.log("joinedconfidentialThreadas mod");
        const waitingRoom = await this.props.space.joinThreadByAddress(moderatorsSpace[waitingRoomName]);
        console.log("opened  waitingroom")
        const rawPosts = await waitingRoom.getPosts();
        console.log("waiting room raw posts", rawPosts);

        if(rawPosts.length > 0) {
          const mostRecent = JSON.parse(rawPosts[rawPosts.length -1 ].message);
          console.log("in waiting room ", mostRecent.waitingRoom);

          mostRecent.waitingRoom.map(async address => {
            await confidentialThread.addMember(address);
          });
          //TODO naive solution fix if time
          const newWaitingRoom = {waitingRoom : [], added : mostRecent.added.concat(mostRecent.waitingRoom)}
          console.log("newWaitinRoom", newWaitingRoom);
          const inConfidentialThread = await confidentialThread.listMembers();
          console.log("list members", inConfidentialThread);
          await waitingRoom.deletePost(rawPosts[rawPosts.length -1].postId);
          await waitingRoom.post(JSON.stringify(newWaitingRoom))

        }
        this.setState({teamThread : confidentialThread});
        this.getPosts();
      }
    }
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
        {this.state.moderatorWillAdd && <h2>Wait for your moderator to add you</h2>}
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