/*global csvjson*/
(function () {

    'use strict';


    var path = "ARRETS_HORAIRES_CIRCUITS_TAN_GTFS/routes.txt";


    var parseCSV = function (txt) {

        window.jsonResult = csvjson.csv2json(txt, {
            delim: ",",
            textdelim: "\""
        });

        console.log(window.jsonResult);

    };



    $.ajax({
        type: "GET",
        url: path,
        success: function (result) {

            console.log("ici");

            window.result = result;

            parseCSV(result);
        }
    });




}());