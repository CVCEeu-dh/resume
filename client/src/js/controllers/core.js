/**
 * @ngdoc function
 * @name resume.controller:coreCtrl
 * @description
 * # CoreCtrl
 * common functions go here.
 */
angular.module('resume')
  .controller('CoreCtrl', function ($scope, $log, RUNTIME) {
    $log.log('CoreCtrl ready, user:', RUNTIME.user.username);
  });
  