/*global google*/
(function () {

    'use strict';

    window.app.controller('homeController', [
        '$rootScope',
        '$scope',
        'parsingService',
        'userService',
        'zenbusService',
        function ($rootScope, $scope, parsingService, userService, zenbusService) {

            //Init Google map

            var initialize = function () {
                var mapOptions = {
                    center: new google.maps.LatLng(47.2212352, -1.5644707),
                    zoom: 12
                };

                window.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            };

            initialize();


            var randomColor = function () {
                return '#' + Math.floor(Math.random() * 16777215).toString(16);
            };

            var makePath = function (arr) {

                var paths = [];

                var i,
                    p;
                for (i = 0; i < arr.length; i++) {

                    p = new google.maps.LatLng(arr[i].latitude, arr[i].longitude);
                    paths.push(p);
                }

                return paths;

            };

            var drawShape = function (paths) {

                var flightPath = new google.maps.Polyline({
                    path: paths,
                    geodesic: true,
                    strokeColor: randomColor(),
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                flightPath.setMap(window.map);
            };

            var drawMarker = function (name, latitude, longitude) {

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(latitude, longitude),
                    title: name
                });

                marker.setMap(window.map);
            };



            $rootScope.step = 0;

            //User loaded files
            $scope.onFileSelect = function (files) {

                parsingService.routes = files[3];
                parsingService.shapes = files[4];
                parsingService.stopTimes = files[5];
                parsingService.stops = files[6];
                parsingService.trips = files[7];

                parsingService.getRoutes(function (routes) {

                    $rootScope.loading = 100;

                    $scope.$apply(function () {

                        $rootScope.step = 2;
                        $scope.routes = routes;
                        $rootScope.loading = 0;

                    });

                });

            };

            //Route selected
            $scope.onRouteSelected = function (routeId) {

                $rootScope.step = 3;

                $rootScope.loading = 100;

                //Show shapes and stops
                parsingService.getShapesAndStops(routeId, function (shapes, stops) {

                    $scope.$apply(function () {

                        $scope.shapes = shapes;

                        var i;

                        //Draw shapes
                        var shapeId = null;
                        for (shapeId in shapes) {

                            if (shapes.hasOwnProperty(shapeId)) {

                                drawShape(makePath(shapes[shapeId]));
                            }

                        }

                        //Markers
                        var currentStop = null;
                        for (i = 0; i < stops.length; i++) {

                            currentStop = stops[i];

                            drawMarker(currentStop.name, currentStop.latitude, currentStop.longitude);
                        }

                        $rootScope.loading = 0;

                        console.log("Log before sendGTFS");

                        zenbusService.sendGTFS(routeId, shapes, stops);

                    });

                });

            };
        }
    ]);

}());