import React, { Component } from 'react';
import TODO from './../Components/TODO';






export default class Personal extends Component {
  parsePosts = (postArr) => {
    return postArr.map((rawPost) => {
      console.log("rawPost", rawPost)
      let post = JSON.parse(rawPost.message);
      post.id = rawPost.postId;
      return post;
    });
  }

  async componentDidMount() {

    const post = JSON.stringify({ text: 'fed cat', completed: false, show: true })
    const personalList = await this.props.space.createConfidentialThread('personalList');

    await personalList.post(post);
    const rawPosts = await personalList.getPosts();
    const posts = this.parsePosts(rawPosts);
    console.log(posts);
    this.setState({ posts });

  }

  render() {
    return (
      <div>
        <h2>Personal TODOs</h2>
        <TODO />
      </div>
    )
  }
}