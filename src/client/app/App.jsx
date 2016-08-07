import React, { Component } from 'react';
import { Link } from 'react-router';
import Home from './Home.jsx';
import Subscribe from './Subscribe.jsx';

class App extends Component {
  render() {
    return (
      <div>
        <div className='header'>
          <span className='title'><Link to="/">SMS List</Link></span>
          <span className='links'>
            <Link to="/" onlyActiveOnIndex>Home</Link>
            <Link to="/subscribe">Subscribe</Link>
          </span>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default App;
