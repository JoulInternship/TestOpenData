(function () {

    'use strict';

    window.app.factory('filesValidation', [
        function () {

            var REQUIRED_FILES = {
                'agency.txt': null,
                'stops.txt': null,
                'routes.txt': null,
                'trips.txt': null,
                'stop_times.txt': null,
                'calendar.txt': null,

                getAgency : function () {
                    return this['agency.txt'];
                },
                getStops : function () {
                    return this['stops.txt'];
                },
                getRoutes : function () {
                    return this['routes.txt'];
                },
                getTrips : function () {
                    return this['trips.txt'];
                },
                getStopTimes : function () {
                    return this['stop_times.txt'];
                },
                getCalendar : function () {
                    return this['calendar.txt'];
                }
            },
                OPTIONNAL_FILES = {
                    'calendar_dates.txt': null,
                    'fare_attributes.txt': null,
                    'fare_rules.txt': null,
                    'shapes.txt': null,
                    'frequencies.txt': null,
                    'transfers.txt': null,
                    'feed_info.txt': null
                },
                REQUIRED_FILES_COUNT = 6,
                FILES_ERRORS = {
                    filesLengthError : "Nombre de fichiers insuffisant.",
                    requiredFilesLengthError : "Nombre de fichiers requis insuffisant."
                };


            return {

                validate : function (files, callback) {

                    if (files.length >= REQUIRED_FILES_COUNT) {

                        angular.forEach(files, function (file) {

                            if (REQUIRED_FILES[file.name] === null) {

                                REQUIRED_FILES[file.name] = file;
                                REQUIRED_FILES_COUNT = REQUIRED_FILES_COUNT - 1;

                            } else if (!OPTIONNAL_FILES[file.name]) {
                                OPTIONNAL_FILES[file.name] = file;
                            }

                        });

                        if (!REQUIRED_FILES_COUNT) {

                            REQUIRED_FILES['shapes.txt'] = OPTIONNAL_FILES['shapes.txt'];
                            REQUIRED_FILES.getShapes = function () {
                                return this['shapes.txt'];
                            };

                            callback(false, REQUIRED_FILES);

                        } else {
                            callback(FILES_ERRORS.requiredFilesLengthError, false);
                        }


                    } else {
                        callback(FILES_ERRORS.filesLengthError, false);
                        return;
                    }
                }

            };
        }
    ]);


}());