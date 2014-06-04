/*global csvjson, FileReader */
(function () {

    'use strict';


    window.app.factory('parsingService', [function () {

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


        return {

            routes : null,
            shapes : null,
            stopTimes : null,
            stops : null,
            trips : null,

            getRoutes : function (callback) {
                getRows(this.routes, callback);
            },

            getShapesAndStops: function (routeId, callback) {

                var that = this;

                getRows(that.trips, function (trips) {

                    //Get trips linked with this route
                    var routeTrips = $.grep(trips, function (elem) {
                        return routeId === elem.route_id;
                    });

                    var shapeList = [], //array of shapeID
                        tripList = [], //array of tripID
                        shapeId = null,
                        tripId = null,
                        i = 0,
                        max = routeTrips.length;

                    //For each trips
                    //get the shape and trip id
                    for (i = 0; i < max; i++) {

                        shapeId = routeTrips[i].shape_id;
                        tripId = routeTrips[i].trip_id;

                        if (!inArray(shapeList, shapeId)) {
                            shapeList.push(shapeId);
                        }

                        if (!inArray(tripList, tripId)) {
                            tripList.push(tripId);
                        }

                    }


                    var myShapes = {}, //final shapes object
                        myStopsIds  = [],
                        myStops = []; //final stops object

                    //Get Shapes
                    getRows(that.shapes, function (shapes) {

                        var shapesTemp = $.grep(shapes, function (elem) {
                            return shapeList.indexOf(elem.shape_id) > -1;
                        });

                        for (i = 0; i < shapeList.length; i++) {
                            myShapes[shapeList[i]] = [];
                        }

                        var shape = shapeList[i];
                        for (i = 0; i < shapesTemp.length; i++) {
                            shape = shapesTemp[i];
                            myShapes[shape.shape_id].push({
                                latitude : shape.shape_pt_lat,
                                longitude : shape.shape_pt_lon
                            });
                        }

                        //Get stops id with stopTimes
                        getRows(that.stopTimes, function (stopTimes) {

                            //Get stopIDs
                            var stopsIdTemp = $.grep(stopTimes, function (elem) {
                                return tripList.indexOf(elem.trip_id) > -1;
                            });

                            var stopIdTemp = null;

                            for (i = 0; i < stopsIdTemp.length; i++) {

                                stopIdTemp = stopsIdTemp[i].stop_id;

                                if (!inArray(myStopsIds, stopIdTemp)) {
                                    myStopsIds.push(stopIdTemp);
                                }
                            }

                            //Get stops
                            getRows(that.stops, function (stops) {

                                var stopsTemp = $.grep(stops, function (elem) {
                                    return myStopsIds.indexOf(elem.stop_id) > -1;
                                });

                                var stop = null;

                                for (i = 0; i < stopsTemp.length; i++) {

                                    stop = stopsTemp[i];

                                    if (!inArray(myStops, stop)) {
                                        myStops.push({
                                            id: stop.stop_id,
                                            latitude: stop.stop_lat,
                                            longitude: stop.stop_lon,
                                            name: stop.stop_name
                                        });
                                    }
                                }

                                callback(myShapes, myStops);

                            });

                        });
                    });

                });

            }
        };

    }]);


}());