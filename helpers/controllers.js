/*
  Basic REST API controller helper.
  generate a very simple model that can be extended
  and helps validate entries
*/
var async    = require('async'),
    _        = require('lodash');

module.exports = function(options) {
  // load the correct models for the item
  var Model = require('../models/' + options.model);

  return function(io) {
    // io is available
    return {
      get: function(req, res){
        res.ok('zarro', io);
      },
      findAll: function(req, res) {
        var params = {
          user_uid: req.user.uid
        };
        console.log(req.user)
        Model.getMany(params, function(err, items, info){
          if(err)
            return res.error(500, err);
          return res.ok(items, info);
        });
      }
    };
  };
};