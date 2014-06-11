(function () {

    'use strict';

    window.app.factory('filesValidation', [
        '$q',
        '$timeout',
        function ($q, $timeout) {

            var REQUIRED_FILES,
                REQUIRED_FILES_NAME,
                OPTIONNAL_FILES,
                OPTIONNAL_FILES_NAME,
                REQUIRED_FILES_COUNT,
                OPTIONNAL_FILES_COUNT,
                FILES_ERRORS = {
                    filesLengthError : "Nombre de fichiers insuffisant.",
                    requiredFilesLengthError : "Nombre de fichiers requis insuffisant. Impossible de continuer la procédure"
                };

            var init = function () {

                REQUIRED_FILES_NAME = [
                    'agency.txt',
                    'stops.txt',
                    'routes.txt',
                    'trips.txt',
                    'stop_times.txt',
                    'calendar.txt'
                ];

                OPTIONNAL_FILES_NAME = [
                    'calendar_dates.txt',
                    'fare_attributes.txt',
                    'fare_rules.txt',
                    'shapes.txt',
                    'frequencies.txt',
                    'transfers.txt',
                    'feed_info.txt'
                ];

                REQUIRED_FILES = {
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
                };

                OPTIONNAL_FILES = {
                    'calendar_dates.txt': null,
                    'fare_attributes.txt': null,
                    'fare_rules.txt': null,
                    'shapes.txt': null,
                    'frequencies.txt': null,
                    'transfers.txt': null,
                    'feed_info.txt': null
                };

                REQUIRED_FILES_COUNT = 0;

                OPTIONNAL_FILES_COUNT = 0;

            };

            init();


            return {

                reset : init, //reset service

                validate : function (files, callback) {

                    var defered = $q.defer();

                    //Just wait for the promise to be returned
                    $timeout(function () {

                        /**
                         * A notification for controller
                         * @type {Object}
                            {
                                txt: "",
                                status: "primary" //@see http://getbootstrap.com/css/#helper-classes
                                required: true //if a required file
                            };
                         */
                        defered.notify({
                            txt: 'start',
                            status: 'primary',
                            required: false
                        });

                        //Save files
                        angular.forEach(files, function (file) {

                            //If it's a required file
                            if (REQUIRED_FILES[file.name] === null) {

                                REQUIRED_FILES[file.name] = file;

                            } else if (OPTIONNAL_FILES[file.name] === null) { //If it's a optionnal file
                                OPTIONNAL_FILES[file.name] = file;
                            }

                        });

                        REQUIRED_FILES_COUNT = 0;
                        OPTIONNAL_FILES_COUNT = 0;

                        //Notify missing required files
                        angular.forEach(REQUIRED_FILES_NAME, function (file) {

                            //If file is still null
                            if (REQUIRED_FILES[file] === null) {
                                defered.notify({
                                    txt: file,
                                    status: 'warning',
                                    required: true
                                });
                            } else { //it's ok

                                REQUIRED_FILES_COUNT++;

                                defered.notify({
                                    txt: file,
                                    status: 'success',
                                    required: true
                                });
                            }

                        });

                        //Notify missing optionnals files
                        angular.forEach(OPTIONNAL_FILES_NAME, function (file) {

                            //If file is still null
                            if (OPTIONNAL_FILES[file] === null) {

                                defered.notify({
                                    txt: file,
                                    status: file === 'shapes.txt' ? 'warning' : 'muted',
                                    required: false
                                });
                            } else { //it's ok

                                OPTIONNAL_FILES_COUNT++;

                                defered.notify({
                                    txt: file,
                                    status: 'success',
                                    required: false
                                });

                            }

                        });

                        //If all required files are present
                        if (REQUIRED_FILES_COUNT === 6) {

                            REQUIRED_FILES['shapes.txt'] = OPTIONNAL_FILES['shapes.txt'];
                            REQUIRED_FILES.getShapes = function () {
                                return this['shapes.txt'];
                            };

                            defered.resolve({
                                files: REQUIRED_FILES,
                                shapes : REQUIRED_FILES['shapes.txt'] === null ? false : true
                            });

                        } else {

                            defered.reject({
                                error: FILES_ERRORS.requiredFilesLengthError,
                                filesPresent : (REQUIRED_FILES_COUNT !== 6 || OPTIONNAL_FILES_COUNT !== 0) ? true : false
                            });
                        }

                    }, 0);

                    return defered.promise;
                }

            };
        }
    ]);


}());