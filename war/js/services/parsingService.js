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

                var forKeyInObject = function (ob) {

                    //console.log(ob);

                    var key, i;
                    for (key in ob) {
                        if (ob.hasOwnProperty(key)) {

                            //console.log(key);

                            if (ob[key] === elem) {
                                return key;
                            }
                            if ($.isArray(ob[key])) {
                                for (i = 0; i < ob[key].length; i++) {
                                    if (ob[key][i] === elem) {
                                        console.log(key);
                                        return key;
                                    }
                                }
                            } else if (typeof ob[key] === 'object') {
                                return forKeyInObject(ob[key]);
                            }
                        }
                    }

                };

                return forKeyInObject(object);
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

                var key;
                for (key in object) {
                    if (object.hasOwnProperty(key)) {

                        if (inArray(object[key].tempStopIds, elem)) {
                            return key;
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


            var workWithShapes = function (deferred) {

                deferred.notify('Shapes given :) ');

                var startUri = lowerString(accountService.get('uri')) + ":" + lowerString(accountService.get('networkName'));

                var tripsFile     = allFiles.getTrips(),
                    stopTimesFile = allFiles.getStopTimes(),
                    stopsFile     = allFiles.getStops(),
                    shapesFile    = allFiles.getShapes();

                var shapes = {}, //shapes object
                    pois = {}, //pois object
                    missions = {}; //missions object

                var stopIdByMission = {};

                deferred.notify('Find trips for routes');

                //Get all trips linked with routeID
                getRows(tripsFile, function (tripsRows) {

                    var shapeIds = [], //array of shapeID
                        tripIds = {}; //array of tripID:shapeID

                    //Get trips linked with this route
                    $.grep(tripsRows, function (elem) {
                        if (inArray(routeIds, elem.route_id)) {

                            tripIds[elem.trip_id] = elem.shape_id;

                            if (!inArray(shapeIds, elem.shape_id)) {
                                shapeIds.push(elem.shape_id);
                            }
                        }
                    });

                    //Get all stopId that we need
                    //So we have to open stopTimes (link between trip_id and stop_id)
                    getRows(stopTimesFile, function (stopTimesRows) {

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

                        console.log('stopIdByMission', stopIdByMission);

                        deferred.notify('Find stops and missions.');

                        getRows(stopsFile, function (stopsRows) {

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

                                        missions[shapeId].uri = startUri + ':mission:' + lowerString(shapeId);
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

                            deferred.notify('There are shapes');

                            getRows(shapesFile, function (shapesRows) {

                                $.grep(shapesRows, function (elem) {

                                    if (inArray(shapeIds, elem.shape_id)) {

                                        //Save shape's points

                                        if (!shapes[elem.shape_id] || !$.isArray(shapes[elem.shape_id].points)) {

                                            shapes[elem.shape_id] = {};

                                            shapes[elem.shape_id].uri = startUri
                                                + ":shape:"
                                                + lowerString(String(elem.shape_id));
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

                                convertAndSend(pois, shapes, missions, deferred);

                            });


                        });


                    });

                });

            };

            var workWithoutShapes = function (deferred) {

                /**
                 *
                 * 0- init objects
                 *    pois = {}
                 *    shapes = {}
                 *    mission = {}
                 * 
                 * 1- get trips for routes
                 *     stopTimesByTrip = {
                 *         tripID = []
                 *     }
                 * 
                 * 2- put each interesting stopTimes in the good trip array
                 *    stopTimesByTrip[elem.trip_id].push()
                 *
                 * 3- compare each stopTimesByTrip array
                 *    1- create new shape[startUri + ':shape:' + tripId] with info
                 *       and push all stopId in temp stopId key
                 *    2- create new mission[startUri + ':shape:' + tripId] with info
                 *
                 * 4- for each stop
                 *    var shapeId = stop_id in array deep shapes;
                 *    if (shapeId) {
                 *       1- push in pois
                 *       2- push in shapes[shapeId].points
                 *       3- push in missions[shapeId].pois
                 *    }
                 * 
                 */

                deferred.notify('No shapes given :( ');

                var startUri = lowerString(accountService.get('uri')) + ":" + lowerString(accountService.get('networkName'));

                var tripsFile     = allFiles.getTrips(),
                    stopTimesFile = allFiles.getStopTimes(),
                    stopsFile     = allFiles.getStops();

                var shapes = {}, //shapes object
                    pois = {}, //pois object
                    missions = {}; //missions object

                var stopTimesByTrip = {};

                deferred.notify('Find trips for routes');

                //Get all trips linked with routeID
                getRows(tripsFile, function (tripsRows) {

                    //Get trips linked with this route
                    $.grep(tripsRows, function (elem) {
                        if (inArray(routeIds, elem.route_id)) {
                            stopTimesByTrip[elem.trip_id] = [];
                        }
                    });

                    //Get all stopId that we need
                    //So we have to open stopTimes (link between trip_id and stop_id)
                    getRows(stopTimesFile, function (stopTimesRows) {

                        $.grep(stopTimesRows, function (elem) {

                            //Save stop_id
                            if ($.isArray(stopTimesByTrip[elem.trip_id])) {
                                stopTimesByTrip[elem.trip_id].push(elem.stop_id);
                            }

                        });

                        var uniqueTrips = uniqueChildren(stopTimesByTrip);

                        //Defined 1 shape and 1 mission for one unique trip

                        var trip;
                        for (trip in uniqueTrips) {
                            if (uniqueTrips.hasOwnProperty(trip)) {

                                shapes[startUri + ':shape:' + lowerString(trip)] = {
                                    uri : startUri + ':shape:' + lowerString(trip),
                                    desc : "",
                                    meta : "",
                                    points : [],
                                    tempStopIds : uniqueTrips[trip]
                                };

                                missions[startUri + ':shape:' + lowerString(trip)] = {
                                    uri : startUri + ':mission:' + lowerString(trip),
                                    name : trip,
                                    desc : "",
                                    meta : "",
                                    pois : []
                                };

                            }
                        }

                        var shapeID,
                            poiAnchor;

                        getRows(stopsFile, function (stopsRows) {

                            $.grep(stopsRows, function (elem) {

                                shapeID = inTempStopIds(shapes, elem.stop_id);

                                if (shapeID) {

                                    //Add in shapes
                                    shapes[shapeID].points.push({
                                        latitude: elem.stop_lat,
                                        longitude: elem.stop_lon
                                    });

                                    //Add in missions
                                    poiAnchor = {};
                                    poiAnchor[startUri + ":stop:" + lowerString(elem.stop_name)] = [];

                                    missions[shapeID].pois.push(poiAnchor);

                                    //Add in pois if needed
                                    if (!pois[elem.stop_id]) {

                                        pois[lowerString(elem.stop_id)] = {
                                            uri: startUri + ':stop:' + lowerString(elem.stop_id),
                                            name: elem.stop_name,
                                            latitude: elem.stop_lat,
                                            longitude: elem.stop_lon
                                        };
                                    }
                                }
                            });

                            //Delete tempStopIds
                            var shape;
                            for (shape in shapes) {
                                if (shapes.hasOwnProperty(shape)) {

                                    delete shapes[shape].tempStopIds;

                                }
                            }

                            convertAndSend(pois, shapes, missions, deferred);

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
                            workWithShapes(deferred);
                        } else {
                            workWithoutShapes(deferred);
                        }

                    }, 0);

                    return deferred.promise;

                }
            };

        }
    ]);


}());