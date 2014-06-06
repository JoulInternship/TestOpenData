(function () {

    'use strict';

    window.app.controller('filesController', [
        '$scope',
        '$rootScope',
        '$location',
        'parsingService',
        'filesValidation',
        'zenbusService',
        function ($scope, $rootScope, $location, parsingService, filesValidation, zenbusService) {

            $rootScope.step = 0;
            $rootScope.loading = 0;

            //User loaded files
            $scope.onFileSelect = function (files) {

                filesValidation.validate(files, function (err, files) {


                    if (err) {

                        $rootScope.modal = {
                            title: "Erreur",
                            message: err
                        };

                        $('#Modal').modal('show');

                    } else {

                        console.log(files);

                        parsingService.files(files);

                        $location.url('/lines');
                    }

                });

            };
        }
    ]);

}());