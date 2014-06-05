/*global latinize*/
(function () {

    'use strict';

    window.app.factory('zenbusService', [
        '$resource',
        'userService',
        function ($resource, userService) {

            return {

                /**
                 * sendData
                 *
                 * Send data
                 *
                 * @params {object} data
                 *
                    var data = {
                        mission : ,

                        shapes : shapes,
                        pois : pois
                    }
                 */
                sendData : function (data) {

                    console.log(data);

                    //Angular ngResource
                    var resource = $resource(
                        userService.get('urlPush'),
                        null,
                        {
                            push : {
                                method: "PUT"
                            }
                        }
                    );

                    resource.push(null, data, function (value, responseHeaders) {

                        console.log("Data send", value);

                    });

                }

            };

        }
    ]);

}());