import React, { Component } from 'react';
import $ from 'jquery';

class Subscribe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      number: '',
      subscribeApi: '/api/contacts/add',
      unsubscribeApi: '/api/contacts/remove',
      loading: false,
      flash: {
        message: '',
        class: ''
      }
    };
  }

  nameChanged(e) {
    this.setState({ name: e.target.value });
  }

  numberChanged(e) {
    this.setState({ number: e.target.value });
  }

  subscribe() {
    var self = this;
    this.setState({ loading: true });
    setTimeout(function () {
      $.ajax({
        url: self.state.subscribeApi,
        data: { name: self.state.name, number: self.state.number },
        dataType: 'json',
        method: 'POST',
        success: function(data) {
          this.setState({ 
            loading: false,
            name: '',
            number: '',
            flash: {
              message: 'contact subscribed',
              class: 'success'
            }
          });
        }.bind(self),
        error: function(xhr, status, err) {
          this.setState({ loading: false });
          console.error(status, err.toString());
        }.bind(self)
      });
    }, 0);
  }

  unsubscribe() {
    var self = this;
    this.setState({ loading: true });
    setTimeout(function () {
      $.ajax({
        url: self.state.unsubscribeApi,
        data: { number: self.state.number },
        dataType: 'json',
        method: 'POST',
        success: function(data) {
          this.setState({
            loading: false,
            name: '',
            number: '',
            flash: {
              message: 'contact unsubscribed',
              class: 'success'
            }
          });
        }.bind(self),
        error: function(xhr, status, err) {
          this.setState({ loading: false });
          console.error(status, err.toString());
        }.bind(self)
      });
    }, 0);
  }

  render() {
    if(this.state.flash.message) {
      var flashMessage =
        <div className={'flash ' + this.state.flash.class}>
          {this.state.flash.message}
        </div>
    }

    return (
      <div className='subscribe'>
        <div className='form pure-form pure-form-stacked'>
          {flashMessage}
          <fieldset>
            <input type='text' name='number' placeholder='number' value={this.state.number} onChange={this.numberChanged.bind(this)}/>
            <input type='text' name='name' placeholder='name (optional)' value={this.state.name} onChange={this.nameChanged.bind(this)}/>
            <button className='subscribe pure-button pure-button-custom pure-button-success' onClick={this.subscribe.bind(this)} disabled={this.state.loading}>Subscribe</button>
            <button className='unsubscribe pure-button pure-button-custom pure-button-error' onClick={this.unsubscribe.bind(this)} disabled={this.state.loading}>Unsubscribe</button>
          </fieldset>
        </div>
      </div>
    );
  }
}

export default Subscribe;
