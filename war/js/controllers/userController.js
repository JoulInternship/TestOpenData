(function () {

    'use strict';

    window.app.controller('userController', [
        'accountService',
        '$scope',
        '$rootScope',
        function (accountService, $scope, $rootScope) {

            $scope.uri = accountService.get('uri');
            $scope.networkName = accountService.get('networkName');

            $scope.update = function () {

                accountService.update(null, {
                    uri : $scope.uri,
                    networkName : $scope.networkName
                });

                $rootScope.step = 1;
            };

        }
    ]);


}());