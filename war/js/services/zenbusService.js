(function () {

    'use strict';

    window.app.factory('zenbusService', ['$resource', 'userService', function ($resource, userService) {
        return $resource(
            userService.url,
            null,
            {
                push : {
                    method: "PUT"
                }
            }
        );
    }]);

}());