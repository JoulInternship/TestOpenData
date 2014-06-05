/*global google*/
(function () {

    'use strict';

    window.app.controller('sendController', [
        '$scope',
        '$rootScope',
        '$location',
        '$timeout',
        'parsingService',
        'zenbusService',
        function ($scope, $rootScope, $location, $timeout, parsingService, zenbusService) {

            $rootScope.loading = 0;

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


            $rootScope.loading = 100;

            $timeout(function () {

                //Show shapes and stops
                var promise = parsingService.getRouteObjects();

                promise.then(
                    printResult,
                    function (msg) {
                        console.log("error");

                        if (msg === "noFiles") {
                            $location.url('/files');
                        }
                        if (msg === "noRoutes") {
                            $location.url('/lines');
                        }

                    },
                    function (msg) {
                        console.log(msg);
                    }
                );

            }, 2000);

        }
    ]);

}());