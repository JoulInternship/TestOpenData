(function () {

    'use strict';

    window.app.factory('zenbusService', ['$resource', 'userService', function ($resource, userService) {

        /*var resource = $resource(
            userService.url,
            null,
            {
                push : {
                    method: "PUT"
                }
            }
        );*/

        return {

            sendGTFS : function (shapesGTFS, stopsGTFS) {

                /**
                 * Créer un tableau d'arrêts
                 *
                    var pois = [{
                        uri: ,
                        name: ,     //ok
                        desc: ,     //vide
                        latitude: , //ok
                        longitude:  //ok
                    }]
                 */

                /**
                 * Créer un shape
                 *
                 * On a un id gtfs
                 * 
                    var shapes = [{
                        uri: , 
                        name: ,
                        meta: ,

                        //Les points du shapes
                        points : [{
                            latitude: , //ok
                            logitude:   //ok
                        }]
                    }]
                 */

                /**
                 * Objet final
                 *
                    var data = {
                        account : , //tjrs envoyé, à virer ?
                        mission : , //tjrs envoyé, à virer ?

                        shapes : shapes,
                        pois : pois
                    }
                 */

                console.log();
            }

        };

    }]);

}());