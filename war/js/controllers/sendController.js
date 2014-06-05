/*global google*/
(function () {

    'use strict';

    window.app.controller('sendController', [
        '$rootScope',
        '$scope',
        'parsingService',
        'zenbusService',
        function ($scope, $rootScope, parsingService, zenbusService) {


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

            //Route selected
            /*$scope.onRouteSelected = function (routeIds) {

                var routeId = routeIds[0]; //TODO : pass all routeIds

                $rootScope.step = 3;

                $rootScope.loading = 100;

                //Show shapes and stops
                var promise = parsingService.getRouteObjects(routeId);

                promise.then(printResult, function () {
                    console.log("error");
                }, function (msg) {
                    console.log(msg);
                });

            };*/
        }
    ]);

}());