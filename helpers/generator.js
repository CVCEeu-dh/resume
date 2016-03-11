/*
  Data Generator
  ---
  Generate custom data for each module 'create' function mMainly used for mocha test
  Cfr test/models.*.js

*/
var async    = require('async'),
    _        = require('lodash');

module.exports = function(options) {
  return {
    /*
      used in mocha tests with before() function.
      Creates a bunch of users to test with.
    */
    before: function(suite, done) {
      var self = this,
          User = require('../models/user');
      // creates a bunch of instance to test with.
      return async.series({
        userA: function(callback) {
          User.create(self.user.guest(), callback);
        }
      }, function(err, results){
        if(err){
          console.log('generator.before error'); 
          throw err
        }
        // assign to the external variable suite the values got from the various async calls
        _.assign(suite, results);
        done();
      });
    },
    /*
      used in mocha tests with after() function.
      Remove the users created during the before() 
    */
    after: function(done){
      var self = this;
      var User = require('../models/user');
      // creates a bunch of instance to test with.
      async.series([
        function(callback) {
          User.remove(self.user.guest(), callback);
        }
      ], function(err, results){
        if(err){
          console.log('generator.after error');
          throw err;
        }
        done();
      });

    },
    paper:{
      draft: function() {
        return {
          username    : 'hello-world-for-' + options.suffix,
          password    : 'WorldHello',
          email       : 'test-model-' + options.suffix + '@globetrotter.it',
          firstname   : 'Milky',
          lastame     : 'Way',
          strategy    : 'local', // the strategy passport who creates his account, like local or google or twitter
          about       : '',
          status      : 'draft'
        }
      },
    },
    user: {
      guest: function() {
        return {
          username    : 'hello-world-for-' + options.suffix,
          password    : 'WorldHello',
          email       : 'test-model-' + options.suffix + '@globetrotter.it',
          firstname   : 'Milky',
          lastame     : 'Way',
          strategy    : 'local', // the strategy passport who creates his account, like local or google or twitter
          about       : '',
          status      : 'active'
        }
      },
      
      researcher: function() {
        return _.assign(this.user.guest(), {
          role        : 'researcher',
          username    : 'hello-world-for-' + options.suffix+ '-as-researcher',
          email       : 'test-model-' + options.suffix + '-as-researcher@globetrotter.it',
        });
      },
      
      admin: function() {
        return _.assign(this.user.guest(), {
          role        : 'staff',
          username    : 'hello-world-for-' + options.suffix+ '-as-admin',
          email       : 'test-model-' + options.suffix + 'as-staff@globetrotter.it',
        });
      },
      // that is, the paranoic robot..
      marvin: function() {
        return {
          username    : 'MARVIN',
          password    : 'marvin',
          email       : 'marvin',
          firstname   : 'MARVIN',
          lastame     : 'marvin',
          strategy    : 'local', // the strategy passport who creates his account, like local or google or twitter
          about       : '',
          status      : 'active'
        }
      }
    }
  }
};