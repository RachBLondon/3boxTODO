import React, { Component} from 'react';
import ProfileHover from 'profile-hover';
import BounceLoader from "react-spinners/BounceLoader";

export default class Home extends Component {
    render() {
      return (<>
        <h5 style={{textAlign : "center"}}>Welcome</h5>
        <div style={{width : '180px', margin : "auto", height : '100px'}}>

          <ProfileHover address={this.props.ethAddress} noTheme={true} showName={true}/>
        </div>
        {(!this.props.space)&& <div style={{display : "block", margin : "auto", width : '50px'}}>
              <BounceLoader color={'#D8EEEC'} />
          </div>}
      </>);
    }
  }
