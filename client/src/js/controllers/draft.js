/**
 * @ngdoc function
 * @name resume.controller:DraftCtrl
 * @description
 * # DraftCtrl
 * handle draft writing ;)
 */
angular.module('resume')
  .controller('DraftCtrl', function ($scope, $log) {
    $log.debug('DraftCtrl welcome');

    $scope.contents = "ciao mamma"
    $scope.mediumOptions = {
    	extensions: {
    		markdown: new MeMarkdown(function (md) {
               $scope.markdown = md;
               // socketizza socketizza che é meglio
            })
        }
    }
  });
  