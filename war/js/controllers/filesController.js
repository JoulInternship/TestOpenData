(function () {

    'use strict';

    window.app.controller('filesController', [
        '$scope',
        '$rootScope',
        '$location',
        'parsingService',
        'zenbusService',
        function ($scope, $rootScope, $location, parsingService, zenbusService) {

            $rootScope.step = 0;
            $rootScope.loading = 0;

            //User loaded files
            $scope.onFileSelect = function (files) {

                parsingService.files(files);

                $location.url('/lines');

            };
        }
    ]);

}());