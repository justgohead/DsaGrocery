// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers'])
  .run(function ($ionicPlatform, $cordovaPush) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.views.transition('android');
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html'
      })
      .state('app.news', {
        url: '/news',
        views: {
          'appNews': {
            templateUrl: 'templates/weixinpopular/news.html',
            controller: 'newsCtrl'
          }
        }
      })
      .state('app.todo', {
        url: '/todo',
        views: {
          'appTodo': {
            templateUrl: 'templates/todo/todo.html',
            controller: 'todoCtrl'
          }
        }
      })
      .state('app.about', {
        url: '/about',
        views: {
          'appAbout': {
            templateUrl: 'templates/about.html'
          }
        }
      })
    $urlRouterProvider.otherwise('/app/news');
  });
