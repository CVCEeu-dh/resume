/*
	Model: user
*/
var settings  = require('../settings'),
    model     = require('../helpers/models'),
    utils     = require('../helpers/utils'),

    _         = require('lodash');

module.exports = model({
  model:     'user',
  pluralize: 'users'
}, {
  // status const
  STATUS_ACTIVE: 'active',

  create: function(user, next) {
    // enrich user with some field
    var now = utils.now(),
        uid = utils.generateId(),
        encrypted,
        activation;

    encrypted = utils.pwdEncrypt(user.password, {
      from: 'signup.encrypted',
      secret: settings.secrets.salt
    });

    activation = utils.pwdEncrypt(user.email, {
      from: 'signup.activation',
      secret: settings.secrets.activation, 
      iterations: 23,
      length: 128,
      digest: 'sha1'
    });
    
    var u = _.assign(user, {
      uid                    : uid,                 
      exec_date              : now.date,
      exec_time              : now.time,
      password               : encrypted.key,
      salt                   : encrypted.salt,
      status                 : user.status || 'disabled',
      is_staff               : typeof user.is_staff != 'undefined',
      activation             : activation.key   
    });
    this.wrapOne('create_user', u, next);
  },

  check: function(user, next) {
    
  }
});