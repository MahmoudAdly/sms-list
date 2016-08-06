import React, { Component } from 'react';
import { Link } from 'react-router';
import Home from './Home.jsx';
import Subscribe from './Subscribe.jsx';

class App extends Component {
  render() {
    return (
      <div>
        <h1>SMS List</h1>
        <ul>
          <li><Link to="/" onlyActiveOnIndex>Home</Link></li>
          <li><Link to="/subscribe">Subscribe</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

export default App;
