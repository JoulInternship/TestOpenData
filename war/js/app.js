/*global google*/
(function () {

    'use strict';

    window.app = angular.module('gtfsToZenBus', ['ngRoute', 'ngResource', 'angularFileUpload']);


    window.app.config(function ($routeProvider, $httpProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html',
                controller: 'homeController'
            })
            .when('/loadJson', {
                templateUrl: 'partials/loadJson.html',
                controller: 'loadJsonController'
            })
            .otherwise({redirectTo: '/'});

        //$httpProvider.defaults.headers.common.Accept = 'application/json, text/javascript';

    });

    app.run(function ($rootScope) {

        $rootScope.loading = 0;

    });


}());