/*global reader*/
(function () {

    'use strict';

    window.app.controller("loadJsonController", [
        '$scope',
        function ($scope) {

            $scope.onFileSelect = function (files) {

                console.log(files);

                var jsonFile = files[0];

                reader.readAsText(jsonFile);
                reader.onloadend = function (json) {

                    console.log(json);

                };
            };

        }
    ]);


}());