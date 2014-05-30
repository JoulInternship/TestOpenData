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


            getShapes: function (routeId, tripsTxt, shapesTxt, callback) {

                var that = this;

                that.getRows(tripsTxt, function (trips) {

                    var routeTrips = $.grep(trips, function (elem) {

                        return routeId === elem.route_id;

                    });

                    var shapeList = [],
                        shapeId = null,
                        i = 0,
                        max = routeTrips.length;

                    for (i = 0; i < max; i++) {

                        //TODO : see how to prevent csv2json to create "shape_id" key and not shape_id
                        shapeId = routeTrips[i].shape_id;

                        window.test = routeTrips[i];


                        if (!inArray(shapeList, shapeId)) {
                            shapeList.push(shapeId);
                        }

                    }

                    that.getRows(shapesTxt, function (shapes) {

                        var shapesTemp = $.grep(shapes, function (elem) {
                            return shapeList.indexOf(elem.shape_id) > -1;
                        });

                        var myShapes = {};

                        for (i = 0; i < shapeList.length; i++) {
                            myShapes[shapeList[i]] = [];
                        }

                        for (i = 0; i < shapesTemp.length; i++) {
                            myShapes[shapesTemp[i].shape_id].push({
                                latitude : shapesTemp[i].shape_pt_lat,
                                longitude : shapesTemp[i].shape_pt_lon
                            });
                        }

                        callback(myShapes);

                    });

                });

            }
        };

    }]);


}());