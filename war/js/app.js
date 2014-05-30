/*global google*/
(function () {

    'use strict';

    window.app = angular.module('gtfsToZenBus', ['ngRoute', 'angularFileUpload']);


    window.app.config(function ($routeProvider, $httpProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html',
                controller: 'homeController'
            })
            .otherwise({redirectTo: '/'});

        //$httpProvider.defaults.headers.common.Accept = 'application/json, text/javascript';

    });

    app.run(function ($rootScope) {

        $rootScope.loading = 0;


        var initialize = function () {
            var mapOptions = {
                center: new google.maps.LatLng(47.2212352, -1.5644707),
                zoom: 6
            };
            window.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        };


        google.maps.event.addDomListener(window, 'load', initialize);

    });


}());