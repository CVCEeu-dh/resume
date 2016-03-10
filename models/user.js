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
  create: function(user, next) {
    // enrich user with some field
    var now = utils.now(),
        id = utils.generateId(),
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
       id                    : id,                 
      exec_date              : now.date,
      exec_time              : now.time,
      password               : encrypted.key,
      salt                   : encrypted.salt,
      status                 : user.status || 'disabled',
      activation             : activation.key   
    });
     
    this.wrap('create', u, next);
  },
});