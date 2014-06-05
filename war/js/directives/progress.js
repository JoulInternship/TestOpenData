(function () {

    'use strict';

    window.app.directive('ngProgress', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                progress: "=",
                message: "="
            },
            templateUrl: 'partials/progress.html'
        };
    });

}());