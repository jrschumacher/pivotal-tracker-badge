'use strict';

const fs = require('fs');
const express = require('express');
const cluster = require('express-cluster');
const pivotal = new (require('pivotaljs'))(process.env.PIVOTAL_API_KEY);

const BADGE_DIR = './badges';

console.log('Building badge cache...');
let badges = {};
const badgeDir = fs.readdirSync(BADGE_DIR);
badgeDir.forEach(function(badge) {
  let status = badge.match(/.*\.svg/);

  if(status) {
    badges[status[0].replace(/\.svg/, '')] = fs.readFileSync(BADGE_DIR + '/' + badge);
  }
});
console.log('[done]');

cluster(function(worker) {
  const app = express();
  app.get('/:storyId', function(req, res, next) {
    pivotal.getStory(req.params.storyId, function(err, story) {
      if(err || story.kind === 'error') {
        if(!err && story.code === 'unauthorized_operation') res.type('svg').send(badges.unauthorized);
        else if(!err && story.code === 'unfound_resource') res.type('svg').send(badges.unfound);
        else res.type('svg').send(badges.unknown);
      }
      else if(story.kind === 'story' && badges[story.current_state]) res.type('svg').send(badges[story.current_state]);
      else res.type('svg').send(badges.unknown);
    });
  });

  app.listen(process.env.PORT || 3000);
}, {count: process.env.WEB_CONCURRENCY || 1});
