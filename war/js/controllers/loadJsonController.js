/*global FileReader*/
(function () {

    'use strict';

    window.app.controller("loadJsonController", [
        '$scope',
        'zenbusService',
        function ($scope, zenbusService) {

            var gtfsData = null;

            $scope.onFileSelect = function (files) {

                var reader = new FileReader();

                var jsonFile = files[0];

                reader.readAsText(jsonFile);
                reader.onloadend = function (e) {

                    var json = e.target.result;

                    gtfsData = JSON.parse(json);

                    $scope.$apply(function () {
                        $scope.pois = gtfsData.pois;
                        $scope.shapes = gtfsData.shapes;
                        $scope.center = {
                            latitude: gtfsData.pois[0].latitude,
                            longitude: gtfsData.pois[0].longitude
                        };
                    });


                };
            };

            $scope.sendData = function () {
                if (gtfsData) {
                    zenbusService.sendData(gtfsData);
                } else {
                    console.log("error, no data");
                }
            };
        }
    ]);


}());