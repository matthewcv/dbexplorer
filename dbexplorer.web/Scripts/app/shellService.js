(function() {
    "use strict";

    var shellService = angular.module('shell', []);
    shellService.factory('shell', function () {
        var shell = {
            server: 'SRV_DEV_TRANS\\SMGTRANS',
            database: null,
            table: null,
            breadcrumbs: [],
            shellScope: null,
            
            popBreadcrumbs: function (b) {
                var i = this.breadcrumbs.indexOf(b);
                this.breadcrumbs.splice(i + 1, this.breadcrumbs.length);
            },
            pushBreadcrumb: function (currentState, nextState) {
                var current = this.breadcrumbs[this.breadcrumbs.length - 1];
                angular.extend(current, currentState);
                this.breadcrumbs.push(nextState);
                this.shellScope.view = nextState.view;
            },
            currentBreadcrumb: function () {
                return this.breadcrumbs[this.breadcrumbs.length - 1];
            }
        }
        shell.breadcrumbs.push({ name: shell.server, view: "dbList" });


        return shell;

    });

})();