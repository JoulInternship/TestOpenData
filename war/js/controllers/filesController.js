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

            //Alert messages
            $scope.successMsg = null;
            $scope.warningMsg = null;
            $scope.errorMsg = null;

            $scope.filesPresent = false; //display files list if present

            filesValidation.reset(); //reset service

            $scope.infos = [];

            var files;

            //User loaded files
            $scope.onFileSelect = function (inputFiles) {

                console.log('success');

                $rootScope.loading = 100;

                filesValidation.validate(inputFiles).then(function (result) { //It's ok

                    $rootScope.loading = 0;

                    files = result.files;

                    $scope.filesPresent = true;
                    $scope.successMsg = "Tout est bon.";
                    $scope.errorMsg = null;

                    if (!result.shapes) {

                        var warning = 'Le fichiers "shapes.txt" n\'est pas présent. Continuer en traçant les parcours à l\'aide des arrêts uniquement ?';

                        $rootScope.modal = {
                            title: "Attention",
                            message: warning,
                            cancel: "Importer de nouveaux fichiers",
                            cancelFunction: function () {
                                $scope.restart();
                            }
                        };
                        $('#Modal').modal('show');

                        $scope.warningMsg = warning;
                        $scope.successMsg = false;

                    }

                }, function (err) { // Error

                    console.log("error");

                    $rootScope.loading = 0;
                    $scope.filesPresent = err.filesPresent;

                    $scope.errorMsg = err.error;
                    $scope.warningMsg = null;
                    $scope.sucessMsg = null;

                }, function (info) { //Notification

                    console.log("info");

                    $scope.filesPresent = true;

                    if (info.txt === 'start') {
                        $scope.infos = [];
                    } else {
                        $scope.infos.push(info);
                    }

                });

                $scope.next = function () {

                    parsingService.files(files);

                    $location.url('/lines');

                };

            };
        }
    ]);

}());