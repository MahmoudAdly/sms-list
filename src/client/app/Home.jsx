import React, { Component } from 'react';
import $ from 'jquery';
import _ from 'underscore';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactsApi: '/api/contacts',
      contacts: [],
      initialized: false,
      message: '',
      groupSize: 20
    };
  }

  componentDidMount(e) {
    var self = this;
    setTimeout(function () {
      $.ajax({
        url: self.state.contactsApi,
        dataType: 'json',
        success: function(response) {
          self.setState({ contacts: response.data.contacts, initialized: true });
        }.bind(self),
        error: function(xhr, status, err) {
          console.error(status, err.toString());
        }.bind(self)
      });
    }, 0);
  }

  messageChanged(e) {
    this.setState({ message: e.target.value });
  }

  groupSizeChanged(e) {
    this.setState({ groupSize: e.target.value });
  }

  render() {
    var self = this;
    if(self.state.initialized) {
      var groups = _.map(self.state.contacts, function(item, index){
        return index % self.state.groupSize === 0 ? self.state.contacts.slice(index, index + self.state.groupSize) : null; 
      }).filter(function(item){
        return item; 
      });

      var content = 
        <div className='msg-box pure-form'>
          <legend>Send a new SMS</legend>
          Message:<br/>
          <textarea placeholder='enter your sms message...' onChange={this.messageChanged.bind(this)}></textarea><br/>
          Group size:<br/>
          <input type='number' name='group-size' min='1' max='50' value={this.state.groupSize} onChange={this.groupSizeChanged.bind(this)}/>
          <div className='groups'>
          {
            groups.map(function(obj, i){
              var numbers = obj.join();
              return(
                <div key={i}>
                  Group {i+1} (size: {obj.length}) <a href={'sms:'+ numbers +'?body=' + self.state.message} className='pure-button pure-button-primary'>send</a>
                </div>)
            })
          }
          </div>
        </div>
    } else {
      var content = 
        <div className='loading-lines'>
          <div className='bar bar1'></div>
          <div className='bar bar2'></div>
          <div className='bar bar3'></div>
          <div className='bar bar4'></div>
          <div className='bar bar5'></div>
        </div>
    }
    return (
      content
    );
  }
}

export default Home;
