/*global FileReader*/
(function () {

    'use strict';

    window.app.controller("loadJsonController", [
        '$scope',
        'zenbusService',
        function ($scope, zenbusService) {

            var reader = new FileReader();

            $scope.onFileSelect = function (files) {

                var jsonFile = files[0];

                reader.readAsText(jsonFile);
                reader.onloadend = function (e) {

                    var json = e.target.result;

                    var data = JSON.parse(json);

                    $scope.$apply(function () {
                        $scope.pois = data.pois;
                        $scope.shapes = data.shapes;
                        $scope.center = {
                            latitude: data.pois[0].latitude,
                            longitude: data.pois[0].longitude
                        };
                    });

                    zenbusService.sendData(data);

                };
            };

        }
    ]);


}());