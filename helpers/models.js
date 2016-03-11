/*
  Model helper. generate a very simple model that can be extended
*/
var settings = require('../settings'),
    utils    = require('../helpers/utils.js'),
    parser   = require('../helpers/parser'),
		neo4j    = require('seraph')(settings.neo4j.host),

		async    = require('async'),

    _        = require('lodash');

/*
    generate basic model function: getItem, getItems
    options:{
      model: 'issue',
      pluralize: 'issues'
    }

    @param options
    @param others - dict of other functions
*/
module.exports = function(options, others) {
  var queries = require('decypher')('./queries/' + options.model + '.cyp');
  // console.log('./queries/' + options.model + '.cyp')
  return _.assign({
    queries: queries,
    /*
      use this function to execute the query and return a list of result
    */
    wrapOne: function(queryName, item, next) {
      var now = utils.now(),
          query = parser.agentBrown(queries[queryName], item);
      
      neo4j.query(query, _.assign({
        exec_date: now.date,
        exec_time: now.time
      }, item), function (err, nodes) {
        if(err || !nodes.length) {
          next(err || utils.IS_EMPTY);
          return;
        }
        next(null, nodes[0]);
      });
    },

    /*
      use this function to execute the query and return a list of result
    */
    wrap: function(queryName, item, next) {
      var now = utils.now(),
          query = parser.agentBrown(queries[queryName], item);
      
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
      this.wrapOne('get_' + options.model, item, next);
    },

    /*
      Get many items, with count
      @param params - object containing query param where, limit, offset etc...
    */
    getMany: function(params, next) {
      var self = this,
          params = _.assign({
            limit: params.limit || 10,
            offset: params.offset || 0
          }, params);

      async.series([
        async.apply(self.wrap, 'get_' + options.pluralize, params),// get items
        async.apply(self.wrap, 'count_' + options.pluralize, params) // count_items
      ], function (err, results) {
        if(err)
          next(err);
        else
          next(null, results[0], _.assign(_.first(results[1]),{params: params})); // flatten the count array to a single object.
      });
    },

    /*
      Get and count related items to a speicific item, with params
      
    */
    getRelated: function(item, pluralize, params, next) {
      var self = this,
          params = _.assign({
            uid: item.uid,
            limit: params.limit || 10,
            offset: params.offset || 0
          }, params);

      async.series([
        async.apply(self.wrap, 'get_related_' + pluralize, params),// get items
        async.apply(self.wrap, 'count_related_' + pluralize, params) // count_items
      ], function (err, results) {
        if(err)
          next(err);
        else
          next(null, results[0], _.assign(_.first(results[1]),{params: params})); // flatten the count array to a single object.
      });
    },

    create: function(item, next) {
      // console.log('create', item);
      this.wrapOne('create_' + options.model, _.assign({
        uid: utils.generateId()
      }, item), next);
    },

    /*
      Remove the selected item according to the DELETE query
      provided. e.g for a model named 'user',
      the queries remove_user should be available.

      @param item - object that MUST have a property 'id', neo4j identifier
    */
    remove: function(item, next) {
      neo4j.query(queries['remove_' + options.model], item, next);
    }
  }, others || {});
  
};