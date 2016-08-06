import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './App.jsx';
import Home from './Home.jsx';
import Subscribe from './Subscribe.jsx';

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/subscribe" component={Subscribe}/>
    </Route>
  </Router>
), document.getElementById('app'));
