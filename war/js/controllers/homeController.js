/*global FileReader, google*/
(function () {

    'use strict';

    window.app.controller('homeController', [
        '$rootScope',
        '$scope',
        'parsingService',
        function ($rootScope, $scope, parsingService) {

            $scope.map = {
                draggable: "true",
                center: {
                    latitude: 47.2212352,
                    longitude: -1.5644707
                },
                zoom: 4,
                polylines: []
            };


            $scope.step = 1;

            var routes = null;
            var shapes = null;
            var stopTimes  = null;
            var stops = null;
            var trips = null;

            var reader = new FileReader();


            var onProgress = function (e) {

                $rootScope.loading = e.loaded / e.total * 100;
            };


            $scope.onFileSelect = function (files) {

                routes = files[3];
                shapes = files[4];
                stopTimes = files[5];
                stops = files[6];
                trips = files[7];

                reader.readAsText(routes);


                reader.onprogress = onProgress;

                reader.onloadend = function (e) {

                    $rootScope.loading = 100;

                    var txt = e.target.result;

                    parsingService.getRows(txt, function (routes) {

                        $scope.$apply(function () {

                            $scope.step = 2;
                            $scope.routes = routes;
                            $rootScope.loading = 0;

                            console.log(routes);

                        });

                    });
                };

            };


            $scope.onRouteSelected = function (id) {

                $scope.step = 3;

                $rootScope.loading = 100;

                //Read trips first
                reader.readAsText(trips);

                reader.onprogress = onProgress;

                reader.onloadend = function (e) {

                    /**
                     * On va chercher les trips
                     */

                    var tripsTxt = e.target.result;

                    //And then shapes
                    reader.readAsText(shapes);

                    reader.onloadend = function (e) {

                        var shapesTxt = e.target.result;


                        reader.readAsText(stopTimes);

                        reader.onloadend = function (e) {

                            var stopTimesTxt = e.target.result;


                            reader.readAsText(stops);

                            reader.onloadend = function (e) {

                                var stopsTxt = e.target.result;


                                parsingService.getShapesAndStops(id, tripsTxt, shapesTxt, stopTimesTxt, stopsTxt, function (myShapes, myStops) {

                                    $scope.$apply(function () {

                                        $scope.shapes = myShapes;

                                        var i,
                                            flightPlanCoordinates = [];

                                        //Shape
                                        for (i = 0; i < myShapes[954189].length; i++) {
                                            flightPlanCoordinates.push(new google.maps.LatLng(myShapes[954189][i].latitude, myShapes[954189][i].longitude));
                                        }

                                        var flightPath = new google.maps.Polyline({
                                            path: flightPlanCoordinates,
                                            geodesic: true,
                                            strokeColor: '#FF0000',
                                            strokeOpacity: 1.0,
                                            strokeWeight: 2
                                        });

                                        flightPath.setMap(window.map);

                                        //Markers
                                        var currentStop = null;
                                        var marker;
                                        for (i = 0; i < myStops.length; i++) {

                                            currentStop = myStops[i];

                                            marker = new google.maps.Marker({
                                                position: new google.maps.LatLng(currentStop.latitude, currentStop.longitude),
                                                title: currentStop.name
                                            });

                                            marker.setMap(window.map);
                                        }

                                        $rootScope.loading = 0;

                                    });


                                });
                            };

                        };
                    };
                };

            };

        }
    ]);

}());