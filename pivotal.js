'use strict';

const PivotalJS = require('pivotaljs');

const CODE_UNAUTHORIZED = 'unauthorized_operation',
      CODE_UNFOUND = 'unfound_resource',
      STATE_STARTED = 'started',
      STATE_FINISHED = 'finished',
      STATE_DELIVERED = 'delivered',
      STATE_ACCEPTED = 'accepted',
      STATE_REJECTED = 'rejected';

let Pivotal = {

  init: function() {
    this.pivotal = new PivotalJS();
    return this;
  },

  setKey: function(key) {
    if(key) this.pivotal = new PivotalJS(key);
    return this;
  },

  getStory: function(id, cb) {
    this.pivotal.getStory(id, cb);
    return this;
  }

};


module.exports = Pivotal;
