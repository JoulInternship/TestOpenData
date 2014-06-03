/*global latinize*/
(function () {

    'use strict';

    window.app.factory('zenbusService', [
        '$resource',
        'userService',
        function ($resource, userService) {

            var lowerString = function (str) {
                return window.latinize(str.toLowerCase());
            };

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

                saveFile : function (filename, text) {
                    var pom = document.createElement('a');
                    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                    pom.setAttribute('download', filename);
                    pom.click();
                },

                sendGTFS : function (routeId, shapesGTFS, stopsGTFS) {

                    /**
                     * ShapesGTFS
                     *
                        {
                            954189 : [{
                                latitude: ,
                                longitude: 
                            },
                            {
                                latitude: ,
                                longitude: 
                            }],
                            shapeID : [...],        //remplacer "shapeID" par "uri"

                        }
                     */

                     /**
                      * stopsGTFS
                      *
                        [
                            {
                                id: "StopPoint:APER1",      //remplacer "id“ par "uri" 
                                name: "Ampère",
                                latitude: ,
                                longitude: ,
                            },
                            ...
                        ]
                      */

                    /**
                     * Créer un tableau d'arrêts
                     *
                        var pois = [{
                            uri: ,      //on a un id
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
                            uri: ,  //on a un id
                            name: , //vide
                            meta: , //vide

                            //Les points du shapes
                            points : [{
                                latitude: , //ok
                                longitude:   //ok
                            }]
                        }]
                     */

                    var startUri = lowerString(userService.uri) + ":" + lowerString(userService.networkName);


                    var shapes = $.map(shapesGTFS, function (item, key) {

                        return {
                            uri: startUri + ":" + lowerString(routeId) + ":" + lowerString(key),
                            name: key,
                            points: item
                        };

                    });



                    var pois = $.map(stopsGTFS, function (item, index) {
                        item.uri = startUri + ":stop:" + lowerString(item.name);
                        delete item.id;

                        return item;
                    });



                    var data = {
                        shapes: shapes,
                        pois: pois
                    };

                    this.saveFile('data.json', JSON.stringify(data));

                    this.sendData(data);


                    /**
                     * Objet final
                     *
                        var data = {
                            account : , //tjrs envoyé, à virer ?
                            mission : , //tjrs envoyé, à virer ? (pb du pois  [{poisURI : value}] ???)

                            shapes : shapes,
                            pois : pois
                        }
                     */

                },

                sendData : function (data) {

                    console.log(data);

                }

            };

        }
    ]);

}());