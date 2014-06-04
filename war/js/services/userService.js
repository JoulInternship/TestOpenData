(function () {

    'use strict';

    window.app.factory('userService', function () {
        return {
            urlPush : "http://trailmatcher.appspot.com/zenbus/dashboard/api/beta/semitanTest",
            uri : "semitanTest",
            networkName: "tan"
        };
    });

}());