(function () {

    'use strict';

    window.app.controller('sendController', [
        '$scope',
        '$rootScope',
        'parsingService',
        function ($scope, $rootScope, parsingService) {

            console.log();

           /* parsingService.getRoutes(function (routes) {

                $rootScope.loading = 100;

                $scope.$apply(function () {

                    $scope.routes = routes;
                    $rootScope.loading = 0;

                });

            });*/

        }
    ]);

}());