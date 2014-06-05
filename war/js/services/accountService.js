(function () {

    'use strict';

    window.app.factory('accountService', function () {

        var user = {
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