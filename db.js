'use strict';

const Redis = require('redis');
const shortid = require('shortid');

let DB = {

  connect: function(url) {
    this.client = Redis.createClient(url);
    this.client.on('error', function(err) {
        throw new Error(err);
      });
    return this;
  },

  isConnected: function() {
    return this.client ? true : false;
  },

  getKey: function(id, cb) {
    if(typeof id === 'undefined') cb(false);
    else {
      this.client.get(id, function(err, data) {
        if(err) {
          console.error(err);
          cb(false);
        } else {
          cb(data);
        }
      });
    }
  },

  setKey: function(key, cb) {
    let id = shortid();
    if(!key) throw new Error('Key is required');
    this.client.set(id, key, function(err, data) {
      if(err) {
        console.error(err);
        cb(false);
      }
      else {
        cb(id);
      }
    });
  },

  delKey: function(id, cb) {
    this.client.del(id, cb);
  }

};

module.exports = DB;
