/*
  Model: paper
*/
var settings  = require('../settings'),
    model     = require('../helpers/models'),
    utils     = require('../helpers/utils'),

    _         = require('lodash');

module.exports = model({
  model:     'story',
  pluralize: 'stories'
}, {
  STATUS_DRAFT: 'draft'
});