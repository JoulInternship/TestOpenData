/*global google*/
(function () {

    'use strict';

    window.app = angular.module('gtfsToZenBus', ['ngRoute', 'ngResource', 'angularFileUpload', 'ui.select2']);


    window.app.config(function ($routeProvider, $httpProvider) {

        $routeProvider
            .when('/files', {
                templateUrl: 'partials/files.html',
                controller: 'filesController'
            })
            .when('/lines', {
                templateUrl: 'partials/lines.html',
                controller: 'linesController'
            })
            .when('/send', {
                templateUrl: 'partials/send.html',
                controller: 'sendController'
            })
            .when('/loadJson', {
                templateUrl: 'partials/loadJson.html',
                controller: 'loadJsonController'
            })
            .otherwise({redirectTo: '/files'});

        //$httpProvider.defaults.headers.common.Accept = 'application/json, text/javascript';

    });

    app.run(function ($rootScope) {

        $rootScope.loading = 0;

    });


}());