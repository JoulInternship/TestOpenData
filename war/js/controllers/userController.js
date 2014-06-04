(function () {

    'use strict';

    window.app.controller('userController', [
        'userService',
        '$scope',
        '$rootScope',
        function (userService, $scope, $rootScope) {

            $scope.urlPush = userService.get('urlPush');
            $scope.uri = userService.get('uri');
            $scope.networkName = userService.get('networkName');

            $scope.update = function () {

                userService.update(null, {
                    urlPush : $scope.urlPush,
                    uri : $scope.uri,
                    networkName : $scope.networkName
                });

                $rootScope.step = 1;
            };

        }
    ]);


}());