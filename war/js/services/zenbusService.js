/*global latinize*/
(function () {

    'use strict';

    window.app.factory('zenbusService', [
        '$resource',
        'userService',
        function ($resource, userService) {

            //Make a string lower and without accent
            var lowerString = function (str) {
                return window.latinize(str.toLowerCase());
            };

            /**
             * saveFile
             *
             * Just a tool to save json that will be send to server
             * 
             * @param  {String} filename 
             * @param  {String} text     
             */
            var saveFile = function (filename, text) {
                var pom = document.createElement('a');
                pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                pom.setAttribute('download', filename);
                pom.click();
            };


            return {

                /**
                 * sendGTFS
                 *
                 * Work with GTFS data and send them to server
                 * 
                 * @param  {string} routeId    Will be use for uri
                 * 
                 * @param  {object} shapesGTFS example :
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
                 *
                 * @param  {array} stopsGTFS  example :
                 
                    [
                        {
                            id: "StopPoint:APER1",      //remplacer "id“ par "uri" 
                            name: "Ampère",
                            latitude: ,
                            longitude: ,
                        },
                        ...
                    ]
                 * 
                 */
                sendGTFS : function (routeId, shapesGTFS, stopsGTFS) {

                    /**
                     * Array of POIS
                     *
                        var pois = [{
                            uri: ,      
                            name: ,     //ok
                            desc: ,     //stay empty
                            latitude: , //ok
                            longitude:  //ok
                        }]
                     */

                    /**
                     * Array of shapes
                     * 
                        var shapes = [{
                            uri: ,  
                            name: , //empty
                            meta: , //empty

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

                    saveFile('data.json', JSON.stringify(data));

                    this.sendData(data);

                },


                /**
                 * sendData
                 *
                 * Envoi data au serveur
                 *
                 * @params {object} data
                 *
                    var data = {
                        account : , //tjrs envoyé, à virer ?
                        mission : , //tjrs envoyé, à virer ? (pb du pois  [{poisURI : value}] ???)

                        shapes : shapes,
                        pois : pois
                    }
                 */
                sendData : function (data) {

                    //Angular ngResource
                    var resource = $resource(
                        userService.urlPush,
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