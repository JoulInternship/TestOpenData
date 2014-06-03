(function () {

    'use strict';

    window.app.controller('userController', [
        'userService',
        '$scope',
        '$rootScope',
        function (userService, $scope, $rootScope) {

            $scope.urlPush = userService.urlPush;
            $scope.uri = userService.uri;
            $scope.networkName = userService.networkName;

            $scope.update = function () {

                userService.urlPush = $scope.urlPush;
                userService.uri = $scope.uri;
                userService.networkName = $scope.networkName;

                $rootScope.step = 1;
            };

        }
    ]);


}());