(function () {

    'use strict';

    window.app.directive('ngModal', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                title: "=",
                message: "=",
                ok: "=",
                okFunction: "&",
                cancel: "=",
                cancelFunc: "&"
            },
            templateUrl: 'partials/modal.html'
        };
    });

}());