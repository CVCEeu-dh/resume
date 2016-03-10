'use strict';
var settings = require('../settings'),
    should   = require('should'),
    generator= require('../helpers/generator')({suffix: 'test-model-user'}),

    User     = require('../models/user');

// test settings
describe('model:user', function() {
  it('should create an user', function (done) {
    User.create(generator.user.guest(), function(err, user){
      should.not.exist(err);
      console.log(user);
      done();
    });
  });
});


describe('model:user', function() {
  it('should remove the user created', function (done) {
    User.remove(generator.user.guest(), function(err) {
      should.not.exist(err);
      done();
    });
  });
});