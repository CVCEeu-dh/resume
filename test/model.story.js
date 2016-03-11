'use strict';
var settings = require('../settings'),
    should   = require('should'),
    generator= require('../helpers/generator')({suffix: 'test-model-story'}),

    User      = require('../models/user'),
    Story     = require('../models/story'),

    suite     = {};

before(function(done){
  generator.before(suite, done);
});

after(function(done){
  generator.after(done);
});

describe('model:story', function() {
  it('should create a story (draft) and the user should be the "owner"', function (done) {
    Story.create({
      title: 'untitled',
      status: Story.STATUS_DRAFT,
      user_uid: suite.userA.uid
    }, function(err, story){
      should.not.exist(err);
      should.exist(story.creation_date);
      should.equal(story.owner.uid, suite.userA.uid);
      should.equal(story.props.title, 'untitled');
      // console.log(story);
      suite.storyA = story;
      done();
    });
  });
});

// test settings
describe('model:story done', function() {
  it('should remove the story created', function (done) {
    Story.remove(suite.storyA, function(err) {
      should.not.exist(err);
      done();
    });
  });
});