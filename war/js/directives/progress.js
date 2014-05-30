(function () {

    'use strict';

    window.app.directive('ngProgress', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                progress: "="
            },
            templateUrl: 'partials/progress.html'
        };
    });

}());