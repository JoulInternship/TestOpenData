(function () {

    'use strict';

    window.app.controller('filesController', [
        '$scope',
        '$rootScope',
        'parsingService',
        'zenbusService',
        function ($scope, $rootScope, parsingService, zenbusService) {

            $rootScope.step = 0;

            //User loaded files
            $scope.onFileSelect = function (files) {

                parsingService.files = files;

            };
        }
    ]);

}());