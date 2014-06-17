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

            var gtfsData = null;

            $rootScope.loading = 0;

            $rootScope.loading = 100;
            $rootScope.loadingMsg = "Traitement des fichiers GTFS en cours. L'opération peut durer quelques minutes ...";

            $scope.sendData = function () {
                if (gtfsData) {
                    zenbusService.sendData(gtfsData);
                } else {
                    console.log("error, no data");
                }
            };

            var redirect = function () {
                $location.url('/files');
            };

            if ($.isEmptyObject(parsingService.files())) {
                redirect();
            } else {

                $timeout(function () {

                    //Show shapes and stops
                    var promise = parsingService.getRouteObjects();

                    promise.then(
                        function (data) {

                            gtfsData = data;

                            $scope.shapes = data.shapes;
                            $scope.pois = data.pois;
                            $scope.center = {
                                latitude: data.pois[0].latitude,
                                longitude: data.pois[0].longitude
                            };

                            $rootScope.loading = 0;

                        },
                        function (msg) {

                            if (msg === "noFiles") {
                                redirect();
                            } else if (msg === "noRoutes") {
                                redirect();
                            } else {
                                console.log("error");
                            }

                        },
                        function (msg) {
                            console.log(msg);
                        }
                    );

                }, 2000);

            }

        }
    ]);

}());