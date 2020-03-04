import React, {Component} from 'react';
import TODO from './../Components/TODO';

export default class Personal extends Component {

    render() {
      return (
        <div>
          <h2>Personal TODOs</h2>  
          <TODO />
        </div>
      )
    }
  }