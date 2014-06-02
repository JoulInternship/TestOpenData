(function () {

    'use strict';

    window.app.cotroller('userController', ['userService', function (userService) {

        //Zenbus url
        $scope.url = userService.url;

        $scope.updateUrl = function () {
            userService.url = $scope.url;
        };

    }]);


}());