'use strict';

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cluster = require('express-cluster');
const db = require('./db');
const Badge = require('./badge.js');

if(process.env.REDIS_URL) {
  db.connect(process.env.REDIS_URL);

  if(process.env.PIVOTAL_API_KEY) {
    console.error('Pivotal API key will not be used when connecting to a database.');
  }
}
else if(!process.env.PIVOTAL_API_KEY) {
  throw new Error('PIVOTAL_API_KEY or REDIS_URL is required');
}


function getStoryBadge(req, res) {
  const UUID = req.params.uuid || null;
  db.getKey(req.params.uuid, function(key) {
    const storyId = req.params.storyId;
    const pivotal = require('./pivotal').init();
    if(!key) key = process.env.PIVOTAL_API_KEY;

    pivotal.setKey(key).getStory(storyId, function(err, story) {
      if(err || story.kind === 'error') {
        if(!err && story.code === 'unauthorized_operation') {
          new Badge()
            .setText('pivotal tracker', 'unauthorized error')
            .setColorscheme('grey')
            .build(function(svg, err) {
              res.type('svg').send(svg);
            });
        }
        else if(!err && story.code === 'unfound_resource') {
          new Badge()
            .setText('pivotal tracker', 'unfound resource')
            .setColorscheme('grey')
            .build(function(svg, err) {
              res.type('svg').send(svg);
            });
        }
        else {
          new Badge()
            .setText('pivotal tracker', 'unknown error')
            .setColorscheme('grey')
            .build(function(svg, err) {
              res.type('svg').send(svg);
            });
        }
      }
      else if(story.kind === 'story') {
        console.log(story);
        let badge = new Badge()
            .setText(' '+story.story_type.substr(0,1).toUpperCase()+'#'+storyId, story.current_state);
        if(story.current_state === 'unstarted') badge.setColorscheme('lightgrey');
        else if(story.current_state === 'started') badge.setColorscheme('yellowgreen');
        else if(story.current_state === 'finished') badge.setColorscheme('blue');
        else if(story.current_state === 'delivered') badge.setColorscheme('orange');
        else if(story.current_state === 'accepted') badge.setColorscheme('brightgreen');
        else if(story.current_state === 'rejected') badge.setColorscheme('rejected');
        else badge.setColorscheme('grey');
        badge.build(function(svg, err) {
          res.type('svg').send(svg);
        });
      }
      else {
        new Badge()
          .setText('pivotal tracker', 'unknown error')
          .setColorscheme('grey')
          .build(function(svg, err) {
            res.type('svg').send(svg);
          });
      }
    });
  });
}

function registerApp(req, res) {
  let key = req.body.key;
  if(!key) res.status(400).send('Key is required')
  else {
    db.setKey(key, function(id) {
      res.status(201).send(id);
    });
  }
}

function unregisterApp(req, res) {
  let id = req.params.id;
  db.delKey(id, function(err) {
    if(err) console.error(err);
    res.status(204).send('Unregistered app');
  });
}

cluster(function(worker) {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/public'));

  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
  });

  app.get('/pt-badge', function(req, res) {
    new Badge()
      .setText('pivotal tracker', 'badge')
      .build(function(svg, err) {
        res.type('svg').send(svg);
      });
  });

  app.get('/register', function(req, res) {
    res.sendFile(__dirname + '/public/register.html');
  })
  app.post('/register', registerApp);
  app.delete('/register/:id', unregisterApp);

  app.get('/:storyId', getStoryBadge);
  app.get('/story/show/:storyId', getStoryBadge);
  app.get('/:uuid/story/show/:storyId', getStoryBadge);

  app.listen(process.env.PORT || 3000);
}, {count: process.env.WEB_CONCURRENCY || 1});
