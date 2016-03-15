/**
 * @ngdoc function
 * @name resume.controller:MeCtrl
 * @description
 * # MeCtrl
 * common functions go here.
 */
angular.module('resume')
  .controller('MeCtrl', function ($scope, $log) {
    $log.log('MeCtrl ready, user:', $scope.user);
  });
  