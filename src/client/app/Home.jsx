import React, { Component } from 'react';
import $ from 'jquery';

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

  toggleContactList(e) {
    let contactsListId = e.target.getAttribute('data-contacts-list-id');
    $(`#${contactsListId}`).toggleClass('hidden');
  }

  render() {
    var self = this;
    if(self.state.initialized) {
      var groups = self.state.contacts.map(function(item, index){
        return index % self.state.groupSize === 0 ? self.state.contacts.slice(index, index + self.state.groupSize) : null; 
      }).filter(function(item){
        return item; 
      });

      let groupsDiv;
      
      if(groups.length == 0) {
        groupsDiv = (<div>No contacts yet</div>)
      } else {
        groupsDiv = (
          groups.map(function(group, i){
            let numbers = [];

            group.map(function(contact, i) {
              numbers.push(contact.number);
            }, this);

            let numbersString = numbers.join();
            let smsUrl = 'sms:'+ numbersString +'?body=' + self.state.message;

            let groupsContactsList;
            groupsContactsList = (
              <ul>
              {
                group.map(function(contact, i) {
                  return(<li key={i}>{contact.number} {contact.name.length? `(${contact.name})` : null}</li>)
                })
              }
              </ul>
            )

            let contactsListId = `contactsList-${i}`;

            return(
              <div key={i} className='groupDiv'>
                Group {i+1} (size: {group.length}) <a href={smsUrl} className='pure-button pure-button-primary'>create SMS</a>
                <span className='show-contacts' data-contacts-list-id={contactsListId} onClick={self.toggleContactList.bind(self)}>toggle list</span>
                <div className='groupContactsList collapse hidden' id={contactsListId}>{groupsContactsList}</div>
              </div>
            )
          })
        )
      }

      var content = 
        <div className='msg-box pure-form'>
          <legend>Send a new SMS</legend>
          Message:<br/>
          <textarea className="sms" placeholder='enter your sms message...' onChange={this.messageChanged.bind(this)}></textarea><br/>
          Group size:<br/>
          <input type='number' name='group-size' min='1' max='50' value={this.state.groupSize} onChange={this.groupSizeChanged.bind(this)}/>
          <div className='groups'>
            <p>SMS groups:</p>
            {groupsDiv}
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

    return (content);
  }
}

export default Home;
