import React, { Component} from 'react';
import ProfileHover from 'profile-hover';
export default class Home extends Component {
    render() {
      return (<>
        <h5 style={{textAlign : "center"}}>Welcome</h5>
        <div style={{width : '180px', margin : "auto"}}>

        <ProfileHover address={this.props.ethAddress} noTheme={true}/>
        </div>
      </>);
    }
  }