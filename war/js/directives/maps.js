/*global google*/
(function () {

    'use strict';

    window.app.directive('ngMaps', [
        function () {

            var markerCanvas = null;

            var getMarkerCanvas = function () {

                if (!markerCanvas) {

                    //Create canvas
                    var canvas = document.createElement("canvas");
                    canvas.width = 16;
                    canvas.height = 16;

                    var ctx = canvas.getContext('2d');
                    ctx.lineWidth = 2;

                    ctx.beginPath();
                    ctx.arc(8, 8, 6, 0, Math.PI * 2);
                    ctx.strokeStyle = "#333333";
                    ctx.fillStyle = "#f4efe9";
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    markerCanvas = canvas.toDataURL();
                }

                return markerCanvas;
            };

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
                    strokeWeight: 4
                });

                flightPath.setMap(window.map);
            };

            var drawMarker = function (name, latitude, longitude) {

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(latitude, longitude),
                    title: name,
                    icon: {
                        url: getMarkerCanvas(),
                        size: new google.maps.Size(16, 16)
                        //anchor: new google.maps.Point(0, -16)
                    }
                });

                marker.setMap(window.map);
            };

            var printResult = function (shapes, pois) {

                if (shapes && pois) {

                    var i;

                    //Draw shapes
                    for (i = 0; i < shapes.length; i++) {

                        drawShape(makePath(shapes[i].points));
                    }

                    //Markers
                    var currentStop = null;
                    for (i = 0; i < pois.length; i++) {

                        currentStop = pois[i];

                        drawMarker(currentStop.name, currentStop.latitude, currentStop.longitude);
                    }
                }


            };

            var link = function (scope, element, attrs) {

                scope.$watch('shapes', function () {
                    printResult(scope.shapes, scope.pois);
                });
                scope.$watch('pois', function () {
                    printResult(scope.shapes, scope.pois);
                });


                //Init Google map
                var initialize = function () {
                    var mapOptions = {
                        center: new google.maps.LatLng(47.2212352, -1.5644707),
                        zoom: 12
                    };

                    window.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
                };

                initialize();
            };

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    shapes: "=",
                    pois: "="
                },
                link: link,
                templateUrl: 'partials/maps.html'
            };
        }
    ]);

}());