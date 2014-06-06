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
                okFunc: "=",
                cancel: "=",
                cancelFunc: "="
            },
            templateUrl: 'partials/modal.html'
        };
    });

}());