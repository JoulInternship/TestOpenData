(function () {

    'use strict';

    window.app.factory('zenbusService', [
        '$resource',
        'accountService',
        function ($resource, accountService) {

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
                        'http://localhost:8888/zenbus/dasboard/api/beta/' + accountService.get('uri'),
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