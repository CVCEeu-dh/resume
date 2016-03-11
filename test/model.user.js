'use strict';
var settings = require('../settings'),
    should   = require('should'),
    generator= require('../helpers/generator')({suffix: 'test-model-user'}),

    User     = require('../models/user'),

    __userA;

// test settings
describe('model:user', function() {
  it('should create an user', function (done) {
    User.create(generator.user.guest(), function(err, user){
      should.not.exist(err);
      __userA = user;
      // these properties need to be displayed
      should.exist(__userA.uid)
      should.exist(__userA.username)
      should.exist(__userA.props)
      should.equal(__userA.props.status, User.STATUS_ACTIVE)
      done();
    });
  });
  it('should get the users', function (done) {
    User.getMany({}, function(err, users, info){
      should.not.exist(err);
      should.exist(info.total_items);
      should.exist(info.params.limit);
      should.exist(info.params.offset);
      should.exist(users.length);
      done();
    });
  });

  it('should get the *active* users', function (done) {
    User.getMany({ status: User.STATUS_ACTIVE}, function(err, users, info){
      should.not.exist(err);
      should.exist(info.total_items);
      should.exist(users.length);
      done();
    });
  });
});


describe('model:user', function() {
  it('should remove the user created', function (done) {
    User.remove(__userA, function(err) {
      should.not.exist(err);
      done();
    });
  });
});