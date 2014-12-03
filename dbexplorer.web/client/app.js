var dbExplorerApp;
(function (dbExplorerApp) {
    angular.module("dbexplorer", ['ui.router']).config([
        "$stateProvider", "$locationProvider", "$httpProvider", function ($stateProvider, $locationProvider, httpProvider) {
            $locationProvider.html5Mode(true);

            httpProvider.interceptors.push("httpIntercepter");
            $stateProvider.state("needDatabase", {
                url: "/",
                templateUrl: "/client/views/SelectDatabase.html"
            });

            $stateProvider.state("Db", {
                templateUrl: "/client/views/Database.html",
                url: "/Db?server&database"
            });
        }]).constant("applicationState", {
        knownServers: []
    }).factory("httpIntercepter", [
        "$q", "$rootScope", function (q, root) {
            return {
                'request': function (config) {
                    root.$emit(Events.httpStart);
                    return config;
                },
                'requestError': function (rejection) {
                    console.log("requestError");
                    console.dir(rejection);
                    return rejection;
                },
                'response': function (response) {
                    root.$emit(Events.httpEnd);
                    return response;
                },
                'responseError': function (rejection) {
                    // do something on error
                    root.$emit(Events.httpError, rejection);
                    console.log("responseError");
                    console.dir(rejection);
                    return q.reject(rejection);
                }
            };
        }]);

    var Events = (function () {
        function Events() {
        }
        Events.databaseSelected = 'database-selected';
        Events.httpStart = 'http-request-start';
        Events.httpEnd = 'http-request-end';
        Events.httpError = 'http-request-error';
        return Events;
    })();
    dbExplorerApp.Events = Events;
})(dbExplorerApp || (dbExplorerApp = {}));
//# sourceMappingURL=app.js.map
