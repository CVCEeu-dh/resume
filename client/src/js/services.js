/**
 * @ngdoc service
 * @name resume.services
 * @description
 * # core
 * Resource REST API service Factory.
 */
angular.module('resume')
  /*
    Get a list of stories
  */
  .factory('StoryFactory', function ($resource) {
    return $resource('/api/story/:id');
  })