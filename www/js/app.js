'use strict';

angular.module('pCoachApp', 
    ['ionic', 
    'pCoachApp.services', 
    'pCoachApp.controllers',
    'pCoachApp.directives'])



.config(function($stateProvider, $urlRouterProvider) {


$stateProvider
  .state('main', {
        url : '/main',
        templateUrl : 'templates/main.html',
        controller : 'TodoCtrl'
    })


    .state('new-item', {
        url: '/new-item',
        templateUrl : 'templates/new-item.html',
        controller : 'TodoCtrl'
    })


    .state('edit-item', {
        url: '/edit-item',
        templateUrl : 'templates/edit-item.html',
        controller : 'TodoCtrl'
    });

    $urlRouterProvider.otherwise('main');

 });