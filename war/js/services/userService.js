(function () {

    'use strict';

    window.app.factory('userService', function () {

        var user = {
            urlPush : "http://trailmatcher.appspot.com/zenbus/dashboard/api/beta/semitanTest",
            uri : "semitanTest",
            networkName: "tan"
        };

        return {

            get : function (who) {

                if (who) {
                    return user[who];
                }
                return user;
            },

            update : function (who, what) {

                if (who) {
                    user[who] = what;
                } else {
                    user = what;
                }

                return user[who];
            }

        };
    });

}());