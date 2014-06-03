/*global FileReader*/
(function () {

    'use strict';

    window.app.controller("loadJsonController", [
        '$scope',
        function ($scope) {

            var reader = new FileReader();

            $scope.onFileSelect = function (files) {

                var jsonFile = files[0];

                reader.readAsText(jsonFile);
                reader.onloadend = function (e) {

                    var json = e.target.result;

                    console.log(JSON.parse(json));


                };
            };

        }
    ]);


}());