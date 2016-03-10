var moment   = require('moment'),
    crypto   = require('crypto'),
    shortid   = require('shortid'),

    _        = require('lodash');

/*
  Basic helpers utils for dates and text manipulation
*/
module.exports = {
  /*
    Generate LOCAL uniqueID
  */
  generateId: function() {
    return shortid.generate();
  },
  /*
  Utc now.
  return object date and time

  */
  now: function() {
    var now = moment.utc(),
        result = {};
    
    result.date = now.format();
    result.time = +now.format('X');
    return result;
  },

  /**
  encrypt a password ccording to local settings secret and a random salt.
  */
  pwdEncrypt: function(password, options) {
    var configs = _.assign({
      secret: '',
      salt: crypto.randomBytes(16).toString('hex'),
      iterations: 4096,
      length: 256,
      digest: 'sha256'
    }, options || {});

    return {
      salt: configs.salt,
      key: crypto.pbkdf2Sync(
        configs.secret,
        configs.salt + '::' + password,
        configs.iterations,
        configs.length,
        configs.digest
      ).toString('hex')
    };
  },

  pwdCheck: function(password, encrypted, options) {
    return this.encrypt(password, options).key == encrypted;
  }
}