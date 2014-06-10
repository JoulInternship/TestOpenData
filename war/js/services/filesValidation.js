(function () {

    'use strict';

    window.app.factory('filesValidation', [
        '$q',
        '$timeout',
        function ($q, $timeout) {

            var REQUIRED_FILES_NAME = [
                'agency.txt',
                'stops.txt',
                'routes.txt',
                'trips.txt',
                'stop_times.txt',
                'calendar.txt'
            ],

                OPTIONNAL_FILES_NAME = [
                    'calendar_dates.txt',
                    'fare_attributes.txt',
                    'fare_rules.txt',
                    'shapes.txt',
                    'frequencies.txt',
                    'transfers.txt',
                    'feed_info.txt'
                ],

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
                    requiredFilesLengthError : "Nombre de fichiers requis insuffisant. Impossible de continuer la procédure"
                };


            return {

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


                        angular.forEach(files, function (file) {

                            //If it's a required file
                            if (REQUIRED_FILES[file.name] === null) {

                                REQUIRED_FILES[file.name] = file;
                                REQUIRED_FILES_COUNT = REQUIRED_FILES_COUNT - 1;

                                defered.notify({
                                    txt: file.name,
                                    status: 'success',
                                    required: true
                                });

                            } else if (OPTIONNAL_FILES[file.name] === null) { //If it's a optionnal file
                                OPTIONNAL_FILES[file.name] = file;

                                defered.notify({
                                    txt: file.name,
                                    status: 'success',
                                    required: false
                                });
                            }

                        });

                        //Notify missing optionnals files
                        angular.forEach(OPTIONNAL_FILES_NAME, function (file) {

                            //If file is still null
                            if (OPTIONNAL_FILES[file] === null) {

                                defered.notify({
                                    txt: file,
                                    status: 'muted',
                                    required: false
                                });
                            }

                        });

                        //If all required files are present
                        if (!REQUIRED_FILES_COUNT) {

                            REQUIRED_FILES['shapes.txt'] = OPTIONNAL_FILES['shapes.txt'];
                            REQUIRED_FILES.getShapes = function () {
                                return this['shapes.txt'];
                            };

                            defered.resolve(REQUIRED_FILES);

                        } else {

                            //Notify missing required files
                            angular.forEach(REQUIRED_FILES_NAME, function (file) {

                                //If file is still null
                                if (REQUIRED_FILES[file] === null) {

                                    defered.notify({
                                        txt: file,
                                        status: 'warning',
                                        required: true
                                    });
                                }

                            });

                            defered.reject(FILES_ERRORS.requiredFilesLengthError);
                        }

                    }, 0);

                    return defered.promise;
                }

            };
        }
    ]);


}());