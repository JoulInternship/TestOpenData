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

            filesValidation.reset(); //reset service

            $scope.infos = [];

            var files;

            //User loaded files
            $scope.onFileSelect = function (inputFiles) {

                $rootScope.loading = 100;

                filesValidation.validate(inputFiles).then(function (result) { //It's ok

                    files = result.files;

                    $rootScope.loading = 0;

                    if (!result.shapes) {

                        $scope.warning = true;

                        $rootScope.modal = {
                            title: "Attention",
                            message: 'Le fichiers "shapes.txt" n\'est pas présent. Continuer en traçant les parcours uniquement avec les arrêts ?',
                            cancel: "Importer de nouveaux fichiers",
                            cancelFunction: function () {
                                $scope.restart();
                            }
                        };

                        $('#Modal').modal('show');

                    } else {
                        $scope.success = true;
                    }

                }, function (err) { // Error

                    $rootScope.loading = 0;
                    $scope.error = true;

                    $rootScope.modal = {
                        title: "Erreur",
                        message: err
                    };

                    $('#Modal').modal('show');

                }, function (info) { //Notification

                    $rootScope.loading = 0;

                    if (info.txt === 'start') {
                        $rootScope.step = 2;
                    } else {
                        $scope.infos.push(info);
                    }

                });

                $scope.restart = function () {

                    filesValidation.reset(); //reset service

                    $scope.infos = [];

                    $scope.error = false;
                    $scope.warning = false;
                    $scope.success = false;

                    $rootScope.step = 1;

                    $('#Modal').modal('hide');

                };

                $scope.next = function () {

                    parsingService.files(files);

                    $location.url('/lines');

                };

            };
        }
    ]);

}());