/**
 * @ngdoc function
 * @name resume.controller:coreCtrl
 * @description
 * # CoreCtrl
 * common functions go here.
 */
angular.module('resume')
  .controller('ItemsCtrl', function ($scope, $log, items, model, factory) {
    $log.log('ItemsCtrl ready', items);
    $scope.items = items.result;

  });
  