/*
  Data Generator
  ---
  Generate custom data for each module 'create' function mMainly used for mocha test
  Cfr test/models.*.js

*/
var _        = require('lodash');

module.exports = function(options) {
  return {
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
          status      : 'enabled'
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
          status      : 'enabled'
        }
      }
    }
  }
};