(function () {

    'use strict';

    window.app.controller('linesController', [
        '$scope',
        '$rootScope',
        '$location',
        'parsingService',
        function ($scope, $rootScope, $location, parsingService) {

            $rootScope.loading = 0;

            parsingService.getRoutes(function (routes) {

                if (!routes) {
                    $location.url('/files');
                    return;
                }

                $rootScope.loading = 100;

                $scope.$apply(function () {

                    $scope.routes = routes;
                    $rootScope.loading = 0;

                });

            });

            $scope.onRouteSelected = function (routeIds) {

                parsingService.routeIds(routeIds);

                $location.url('/send');
            };

        }
    ]);

}());