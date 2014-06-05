/*global google*/
(function () {

    'use strict';

    window.app.controller('homeController', [
        '$rootScope',
        '$scope',
        'parsingService',
        'zenbusService',
        function ($rootScope, $scope, parsingService, zenbusService) {


            //TODO : add ui-select2 avec multiples entrées pour les lignes 


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


            var printResult = function (data) {

                console.log("success", data);

                $scope.shapes = data.shapes;

                var i;

                //Draw shapes
                for (i = 0; i < data.shapes.length; i++) {

                    drawShape(makePath(data.shapes[i].points));
                }

                //Markers
                var currentStop = null;
                for (i = 0; i < data.pois.length; i++) {

                    currentStop = data.pois[i];

                    drawMarker(currentStop.name, currentStop.latitude, currentStop.longitude);
                }

                $rootScope.loading = 0;

                zenbusService.sendData(data);
            };



            $rootScope.step = 0;

            //User loaded files
            $scope.onFileSelect = function (files) {

                parsingService.files = files;

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
                var promise = parsingService.getRouteObjects(routeId);

                promise.then(printResult, function () {
                    console.log("error");
                }, function (msg) {
                    console.log(msg);
                });


            };
        }
    ]);

}());