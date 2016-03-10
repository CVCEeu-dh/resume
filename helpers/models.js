var settings = require('../settings'),
    utils    = require('../helpers/utils.js'),
    parser   = require('../helpers/parser'),
		neo4j    = require('seraph')(settings.neo4j.host),

		async    = require('async'),

    _        = require('lodash');

/*
    generate basic model function: getItem, getItems
    configs:{
      model: 'issue',
      pluralize: 'issues'
    }

    @param configs
    @param others - dict of other functions
*/
module.exports = function(configs, others) {
	var queries = require('decypher')('./queries/' + configs.model + '.cyp');

  return _.assign({
    queries: queries,
    wrap: function(prefix, item, next) {
      var now = utils.now(),
          query = parser.agentBrown(this.queries[prefix + '_' +configs.model], item);
      
      neo4j.query(query, _.assign({
        exec_date: now.date,
        exec_time: now.time
      }, item), function (err, nodes) {
        if(err || !nodes.length) {
          next(err || utils.IS_EMPTY);
          return;
        }
        next(null, nodes);
      });
    },
    /*
      Get a single item.
      @param item - object that MUST have a property 'id', neo4j identifier
    */
    get: function(item, next) {
      this.wrap('get', item, next);
    },

    create: function(item, next) {
      console.log('create', item);
      this.wrap('create', _.assign({
        id: utils.generateId()
      }, item), next);
    },

    /*
      Remove the selected item according to the DELETE query
      provided. e.g for a model named 'user',
      the queries remove_user should be available.

      @param item - object that MUST have a property 'id', neo4j identifier
    */
    remove: function(item, next) {
      neo4j.query(queries['remove_' + configs.model], item, next);
    }
  }, others || {});
  
};