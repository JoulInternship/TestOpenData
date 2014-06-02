/*global csvjson */
(function () {

    'use strict';


    window.app.factory('parsingService', [function () {


        var parseCSV = function (txt) {

            var jsonResult = csvjson.csv2json(txt, {
                delim: ","
            });
            return jsonResult;

        };

        var inArray = function (array, elem) {
            return array.indexOf(elem) > -1 ? true : false;
        };

        return {

            /**
             * getRows
             *
             * return row from csv
             * 
             * @param  {String} txt 
             * @return {Array}     
             */
            getRows: function (txt, callback) {

                var result = parseCSV(txt);

                callback(result.rows);

            },


            getShapesAndStops: function (routeId, tripsTxt, shapesTxt, stopTimesTxt, stopsTxt, callback) {

                var that = this;

                that.getRows(tripsTxt, function (trips) {

                    var routeTrips = $.grep(trips, function (elem) {

                        return routeId === elem.route_id;

                    });

                    var shapeList = [],
                        tripList = [],
                        shapeId = null,
                        tripId = null,
                        i = 0,
                        max = routeTrips.length;

                    for (i = 0; i < max; i++) {

                        //TODO : see how to prevent csv2json to create "shape_id" key and not shape_id
                        shapeId = routeTrips[i].shape_id;
                        tripId = routeTrips[i].trip_id;


                        if (!inArray(shapeList, shapeId)) {
                            shapeList.push(shapeId);
                        }

                        if (!inArray(tripList, tripId)) {
                            tripList.push(tripId);
                        }

                    }

                    var myShapes = {},
                        myStopsIds  = [],
                        myStops = [];

                    //Get Shapes
                    that.getRows(shapesTxt, function (shapes) {

                        var shapesTemp = $.grep(shapes, function (elem) {
                            return shapeList.indexOf(elem.shape_id) > -1;
                        });


                        for (i = 0; i < shapeList.length; i++) {
                            myShapes[shapeList[i]] = [];
                        }

                        for (i = 0; i < shapesTemp.length; i++) {
                            myShapes[shapesTemp[i].shape_id].push({
                                latitude : shapesTemp[i].shape_pt_lat,
                                longitude : shapesTemp[i].shape_pt_lon
                            });
                        }

                    });


                    //Get stops id
                    that.getRows(stopTimesTxt, function (stopTimes) {

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

                        //console.log(myStopsIds);

                    });

                    //Get stops
                    that.getRows(stopsTxt, function (stops) {

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

                    });

                    callback(myShapes, myStops);


                });

            }
        };

    }]);


}());