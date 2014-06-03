(function () {

    'use strict';

    window.app.controller('userController', ['userService', '$scope', function (userService, $scope) {

        //Zenbus url
        $scope.url = userService.url;

        $scope.updateUrl = function () {
            userService.url = $scope.url;
        };

    }]);


}());