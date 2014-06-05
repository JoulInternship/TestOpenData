/*global csvjson, FileReader */
(function () {

    'use strict';


    window.app.factory('parsingService', [
        'userService',
        '$q',
        function (userService, $q) {

            var reader = new FileReader();

            var parseCSV = function (txt) {

                var jsonResult = csvjson.csv2json(txt, {
                    delim: ","
                });
                return jsonResult;

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

            var inArray = function (array, elem) {
                return array.indexOf(elem) > -1 ? true : false;
            };

            var inArrayDeep = function (object, elem) {

                var key, i;
                for (key in object) {
                    if (object.hasOwnProperty(key)) {

                        if ($.isArray(object[key])) {

                            for (i = 0; i < object[key].length; i++) {

                                if (object[key][i] === elem) {
                                    return key;
                                }

                            }
                        }
                    }
                }

                return false;
            };

            //Make a string lower and without accent
            var lowerString = function (str) {
                return window.latinize((str.toLowerCase()).replace(/\s/g, "_"));
            };

            var loadTxt = function (txt, callback) {

                reader.readAsText(txt);
                reader.onloadend = callback;
            };

            var objectToArray = function (object) {

                var array = [],
                    key;

                for (key in object) {
                    if (object.hasOwnProperty(key)) {

                        array.push(object[key]);
                    }
                }

                return array;
            };

            /**
             * getRows
             *
             * return row from csv
             * 
             * @param  {String} txt 
             * @return {Array}     
             */
            var getRows = function (txt, callback) {

                loadTxt(txt, function (e) {

                    var csv = e.target.result;

                    var result = parseCSV(csv);
                    callback(result.rows);

                });

            };


            return {

                routes : null,
                shapes : null,
                stopTimes : null,
                stops : null,
                trips : null,

                getRoutes : function (callback) {
                    getRows(this.routes, callback);
                },

                /**
                 * getRouteObjects
                 *
                 * Work with GTFS data 
                 * 
                 * @param  {string} routeId    Will be use for uri
                 * 
                 * @param  {function} callback
                 */
                getRouteObjects : function (routeId, callback) {

                    var deferred = $q.defer();

                    var that = this;

                    var startUri = lowerString(userService.get('uri')) + ":" + lowerString(userService.get('networkName'));

                    var shapes = {}, //shapes object
                        pois = {}, //pois object
                        missions = {}; //missions object

                    var stopIdByMission = {};

                    deferred.notify('Find trips for route ' + routeId);

                    //Get all trips linked with routeID
                    getRows(that.trips, function (tripsRows) {

                        var shapeIds = [], //array of shapeID
                            tripIds = {}; //array of tripID:shapeID

                        //Get trips linked with this route
                        $.grep(tripsRows, function (elem) {
                            if (routeId === elem.route_id) {

                                tripIds[elem.trip_id] = elem.shape_id;

                                if (!inArray(shapeIds, elem.shape_id)) {
                                    shapeIds.push(elem.shape_id);
                                }
                            }
                        });

                        //Get all stopId that we need
                        //So we have to open stopTimes (link between trip_id and stop_id)
                        getRows(that.stopTimes, function (stopTimesRows) {

                            $.grep(stopTimesRows, function (elem) {

                                //Save stop_id in the mission stops array
                                if (tripIds[elem.trip_id]) {

                                    if (!$.isArray(stopIdByMission[tripIds[elem.trip_id]])) {
                                        stopIdByMission[tripIds[elem.trip_id]] = [];
                                    }

                                    if (!inArray(stopIdByMission[tripIds[elem.trip_id]], elem.stop_id)) {
                                        stopIdByMission[tripIds[elem.trip_id]].push(elem.stop_id);
                                    }

                                }

                            });

                            deferred.notify('Find stops and missions.');

                            getRows(that.stops, function (stopsRows) {

                                var poiAnchor;

                                //Put poi in mission's pois array & pois array
                                $.grep(stopsRows, function (elem) {

                                    var shapeId = inArrayDeep(stopIdByMission, elem.stop_id);

                                    if (shapeId) {

                                        //If poi already in pois don't go further
                                        if (!pois[elem.stop_id]) {

                                            pois[elem.stop_id] = {
                                                uri: startUri + ':stop:' + lowerString(elem.stop_id),
                                                name: elem.stop_name,
                                                latitude: elem.stop_lat,
                                                longitude: elem.stop_lon
                                            };
                                        }

                                        //Put poi in the mission stops array

                                        if (!missions[shapeId] || !$.isArray(missions[shapeId].pois)) {

                                            missions[shapeId] = {};

                                            missions[shapeId].uri = startUri + ':' + lowerString(routeId) + ':' + lowerString(shapeId);
                                            missions[shapeId].name = shapeId;
                                            missions[shapeId].meta = "";
                                            missions[shapeId].desc = "";

                                            missions[shapeId].pois = [];
                                        }

                                        poiAnchor = {};
                                        poiAnchor[startUri + ":stop:" + lowerString(elem.stop_name)] = [];

                                        missions[shapeId].pois.push(poiAnchor);

                                    }

                                });

                                deferred.notify('Find shapes.');

                                //Build shapes object
                                getRows(that.shapes, function (shapesRows) {

                                    $.grep(shapesRows, function (elem) {

                                        if (inArray(shapeIds, elem.shape_id)) {

                                            //Save shape's points

                                            if (!shapes[elem.shape_id] || !$.isArray(shapes[elem.shape_id].points)) {

                                                shapes[elem.shape_id] = {};

                                                shapes[elem.shape_id].uri = startUri
                                                    + ":"
                                                    + lowerString(routeId)
                                                    + ":" + lowerString(String(elem.shape_id));
                                                shapes[elem.shape_id].desc = "";
                                                shapes[elem.shape_id].meta = "";

                                                shapes[elem.shape_id].points = [];

                                            }

                                            shapes[elem.shape_id].points.push({
                                                latitude: elem.shape_pt_lat,
                                                longitude: elem.shape_pt_lon
                                            });

                                        }

                                    });

                                    deferred.notify('Convert to array.');

                                    pois = objectToArray(pois);
                                    shapes = objectToArray(shapes);
                                    missions = objectToArray(missions);

                                    var data = {
                                        pois : pois,
                                        shapes : shapes,
                                        missions : missions
                                    };

                                    deferred.resolve(data);

                                    saveFile("data.json", JSON.stringify(data));

                                });



                            });



                        });

                    });

                    return deferred.promise;
                }
            };

        }
    ]);


}());