/**
 * @ngdoc overview
 * @name resume
 * @description
 * # resume
 *
 * Main module of the application.
 */
angular
  .module('resume', [
    'ui.router',
    'ngResource',
    'ngSanitize',
    'ngCookies',
    'angular-medium-editor'
  ])
  .constant('LOCALES', {
    'locales': {
      'en_US': 'English'
    },
    'preferredLocale': 'en_US'
  })
  /*
    Angular-translate configs
    Cfr. https://scotch.io/tutorials/internationalization-of-angularjs-applications
  */
  // .config(function ($translateProvider) {
  //   // $translateProvider.useMissingTranslationHandlerLog();
  //   $translateProvider.useSanitizeValueStrategy('sanitize');
  //   $translateProvider.useStaticFilesLoader({
  //       prefix: 'locale/locale-',// path to translations files
  //       suffix: '.json'// suffix, currently- extension of the translations
  //   });
  //   $translateProvider.preferredLanguage('en_US');// is applied on first load
    
  // })
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .otherwise("/");
    $stateProvider
      .state('index', {
        url: '/',
        controller: 'IndexCtrl',
        templateUrl: 'templates/index.html'
      })
      .state('login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'templates/login.html'
      })
      .state('draft', {
        url: '/create',
        controller: 'DraftCtrl',
        templateUrl: 'templates/draft.html'
      })
      .state('me', {
        abstract: true,
        url: '/me',
        controller: 'MeCtrl',
        templateUrl: 'templates/index.html'
      })
        .state('me.stories', {
          url: '/stories',
          controller: 'MeCtrl',
          templateUrl: 'templates/index.html'
        })
  });
