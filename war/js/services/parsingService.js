/*global csvjson, FileReader */
(function () {

    'use strict';


    window.app.factory('parsingService', [
        'accountService',
        '$q',
        '$timeout',
        function (accountService, $q, $timeout) {

            var allFiles = {},
                routeIds = null;

            var reader = new FileReader();

            var parseCSV = function (txt) {

                var jsonResult = csvjson.csv2json(txt, {
                    delim: ","
                });
                return jsonResult;

            };


            var inArray = function (array, elem) {
                return array.indexOf(elem) > -1 ? true : false;
            };

            /**
             * inTempStopIds
             * @param  {Object} object 
             * {
             *     shapeID : {
             *         uri : '',
             *         tempStopIds : [elem]
             *     }
             * }
             *
             * 
             * @param  {String} elem   [description]
             * @return {String}        shapeId
             */
            var inTempStopIds = function (object, elem) {

                var result = [];

                var key;
                for (key in object) {
                    if (object.hasOwnProperty(key)) {

                        if (inArray(object[key].points, elem)) {
                            result.push(key);
                        }
                    }
                }

                return result;
            };

            //Make a string lower and without accent
            var lowerString = function (str) {
                return window.latinize((str.toLowerCase()).replace(/\s/g, "_"));
            };

            var loadTxt = function (txt, callback) {

                reader.readAsText(txt);
                reader.onloadend = callback;
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

            /**
             * areArraysEquals
             *
             * @param  {Array} arr1
             * @param  {Array} arr2
             * @return {boolean}       returns true even if the elements are in different order. 
             */
            var areArraysEquals = function (arr1, arr2) {
                return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
            };

            /**
             * sortBySequence
             *
             * Used with array.sort(function)
             * 
             * @param  {object} a
             * @param  {object} b
             */
            var sortBySequence = function (a, b) {

                return a.sequence - b.sequence;
            };

            /**
             * uniqueChildren
             *
             * Check all arrays in object and return an object with just the unique ones
             * Doesn't care about the key.
             * 
             * @param  {Object} ob Object of arrays
             * @return {Objetc}        Object of arrays
             */
            var uniqueChildren = function (ob) {

                var results = {};

                var arr;
                var isNew = false;

                var k, j;

                for (k in ob) {

                    if (ob.hasOwnProperty(k)) {

                        //Work on k

                        isNew = true;
                        arr = ob[k];

                        if ($.isEmptyObject(results)) {
                            results[k] = arr;
                        } else {

                            //Test if arrays already in results
                            for (j in results) {
                                if (results.hasOwnProperty(j)) {

                                    //compare k with j already in results

                                    //If k = j
                                    if (areArraysEquals(results[j], arr)) {
                                        isNew = false;
                                        break;
                                    }

                                }
                            }

                            //If it's new, save it
                            if (isNew) {
                                results[k] = arr;
                            }

                        }

                    }

                }

                return results;

            };

            /**
             * objectToArray
             *
             * Convert an objet to array by removing the key
             * 
             * @param  {Object} object
             * @return {Array}        
             */
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
             * convertAndSend
             *
             * Convert objects into array in order to be ready to push
             * Resolve the deferred
             * 
             * @param  {object} pois     
             * @param  {object} shapes   
             * @param  {object} missions 
             * @param  {object} deferred 
             */
            var convertAndSend = function (pois, shapes, missions, deferred) {

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
            };


            /**
             * workOnFiles
             *
             * Parse the GTFS
             * 
             * @param  {object} deferred    a $q.defer()
             * @param  {boolean} shapesGiven 
             */
            var workOnFiles = function (deferred, shapesGiven) {

                if (shapesGiven) {
                    deferred.notify('Shapes given :) ');
                } else {
                    deferred.notify('No shapes given :( ');
                }

                var startUri = lowerString(accountService.get('uri')) + ":" + lowerString(accountService.get('networkName'));

                var tripsFile     = allFiles.getTrips(),
                    stopTimesFile = allFiles.getStopTimes(),
                    stopsFile     = allFiles.getStops(),
                    shapesFile    = allFiles.getShapes();

                var shapes = {}, //shapes object
                    pois = {}, //pois object
                    missions = {}; //missions object

                /**
                 * stopTimesByTrip
                 * @type {Object}
                    {
                        tripId : [stopTimeId, ..., stopTimeId],
                        ...
                    }
                 */
                var stopTimesByTrip = {};

                /**
                 * tripsByShape
                 * @type {Object}
                    {
                        shapeId : [tripId, tripId]
                    }
                 */
                var tripsByShape = {};


                deferred.notify('Find trips for routes');

                //Get all trips linked with routeID
                getRows(tripsFile, function (tripsRows) {

                    //Get trips linked with this route
                    $.grep(tripsRows, function (elem) {

                        //Create a stopTimes array
                        if (inArray(routeIds, elem.route_id)) {
                            stopTimesByTrip[elem.trip_id] = [];

                            //Save shape <-> trip link
                            if (shapesGiven && elem.shape_id !== undefined) {

                                if (!$.isArray(tripsByShape[elem.shape_id])) {
                                    tripsByShape[elem.shape_id] = [];
                                }

                                tripsByShape[elem.shape_id].push(elem.trip_id);
                            }
                        }

                    });

                    //Get all stopId that we need
                    //So we have to open stopTimes (link between trip_id and stop_id)
                    getRows(stopTimesFile, function (stopTimesRows) {

                        $.grep(stopTimesRows, function (elem) {

                            //Save stop_id
                            if ($.isArray(stopTimesByTrip[elem.trip_id])) {
                                stopTimesByTrip[elem.trip_id].push({
                                    id: elem.stop_id,
                                    sequence: elem.stop_sequence
                                });
                            }

                        });

                        //Sort stops by sequence
                        $.each(stopTimesByTrip, function (index, trip) {
                            trip.sort(sortBySequence);
                        });

                        //Transform object in array
                        var key, i;
                        for (key in stopTimesByTrip) {
                            if (stopTimesByTrip.hasOwnProperty(key)) {

                                for (i = 0; i < stopTimesByTrip[key].length; i++) {
                                    stopTimesByTrip[key][i] = stopTimesByTrip[key][i].id;
                                }
                            }
                        }

                        var uniqueTrips = uniqueChildren(stopTimesByTrip);

                        //Define 1 shape and 1 mission for one unique trip

                        var trip;
                        for (trip in uniqueTrips) {
                            if (uniqueTrips.hasOwnProperty(trip)) {

                                shapes[trip] = {
                                    uri : startUri + ':shape:' + lowerString(trip),
                                    desc : "",
                                    meta : "",
                                    points : []
                                };

                                missions[trip] = {
                                    uri : startUri + ':mission:' + lowerString(trip),
                                    name : trip,
                                    desc : "",
                                    meta : "",
                                    pois : []
                                };

                                shapes[trip].points = $.extend([], uniqueTrips[trip]);
                                missions[trip].pois = $.extend([], uniqueTrips[trip]);

                            }
                        }


                        var shapeIDs,
                            poiAnchor;

                        getRows(stopsFile, function (stopsRows) {

                            var index;

                            $.grep(stopsRows, function (elem) {

                                shapeIDs = inTempStopIds(shapes, elem.stop_id);

                                if (shapeIDs.length > 0) {

                                    $.each(shapeIDs, function (i, id) {

                                        //Get point position in array
                                        //Need the exact position to draw the shape
                                        index = shapes[id].points.indexOf(elem.stop_id);

                                        //Add in shapes
                                        shapes[id].points[index] = {
                                            latitude: elem.stop_lat,
                                            longitude: elem.stop_lon
                                        };

                                        //Add in missions
                                        poiAnchor = {};
                                        poiAnchor[startUri + ":stop:" + lowerString(elem.stop_name)] = [];

                                        missions[id].pois[index] = poiAnchor;

                                        //Add in pois if needed
                                        if (!pois[elem.stop_id]) {

                                            pois[lowerString(elem.stop_id)] = {
                                                uri: startUri + ':stop:' + lowerString(elem.stop_id),
                                                name: elem.stop_name,
                                                latitude: elem.stop_lat,
                                                longitude: elem.stop_lon
                                            };
                                        }

                                    });
                                }

                            });

                            //If shapes, use to improve the shapes objects
                            if (shapesGiven) {

                                getRows(shapesFile, function (shapesRows) {

                                    var trips;

                                    $.grep(shapesRows, function (elem) {

                                        trips = tripsByShape[elem.shape_id];

                                        if (trips !== undefined) {

                                            $.each(trips, function (index, trip) {

                                                if (uniqueTrips[trip] !== undefined) {

                                                    if (!shapes[trip].shapeImprovement) {

                                                        shapes[trip].shapeImprovement = true; //add temp key
                                                        shapes[trip].points = [];
                                                    }

                                                    shapes[trip].points.push({
                                                        latitude: elem.shape_pt_lat,
                                                        longitude: elem.shape_pt_lon
                                                    });

                                                }

                                            });
                                        }

                                    });

                                    //delete temp key
                                    $.each(shapes, function (index, shape) {
                                        delete shape.shapeImprovement;
                                    });

                                    convertAndSend(pois, shapes, missions, deferred);
                                });


                            } else {
                                convertAndSend(pois, shapes, missions, deferred);
                            }

                        });

                    });

                });


            };


            return {

                files : function (newFiles) {
                    if (newFiles) {
                        allFiles = newFiles;
                    }

                    return allFiles;
                },

                routeIds : function (newIds) {
                    if (newIds) {
                        routeIds = newIds;
                    }

                    return routeIds;
                },

                getRoutes : function (callback) {

                    if ($.isEmptyObject(allFiles)) {
                        callback(false);
                        return;
                    }

                    getRows(allFiles['routes.txt'], callback);
                },

                /**
                 * getRouteObjects
                 *
                 * Work with GTFS data 
                 * 
                 * @param  {function} callback
                 */
                getRouteObjects : function () {

                    var deferred = $q.defer();

                    if ($.isEmptyObject(allFiles)) {
                        deferred.reject('noFiles');
                        return deferred.promise;
                    }

                    if (!$.isArray(routeIds)) {
                        deferred.reject('noRoutes');
                        return deferred.promise;
                    }

                    //Wait the promise to be returned
                    $timeout(function () {

                        if (allFiles['shapes.txt'] !== null) {
                            workOnFiles(deferred, true);
                        } else {
                            workOnFiles(deferred, false);
                        }

                    }, 0);

                    return deferred.promise;

                }
            };

        }
    ]);


}());