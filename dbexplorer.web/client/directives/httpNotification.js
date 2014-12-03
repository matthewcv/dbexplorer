var dbExplorerApp;
(function (dbExplorerApp) {
    var HttpNotificationDirectiveController = (function () {
        function HttpNotificationDirectiveController(scope, root) {
            this.scope = scope;
            root.$on(dbExplorerApp.Events.httpStart, this.httpStart.bind(this));
            root.$on(dbExplorerApp.Events.httpEnd, this.httpEnd.bind(this));
            root.$on(dbExplorerApp.Events.httpError, this.httpError.bind(this));

            scope.showWaiting = false;
            scope.showError = false;
            scope.errorMessage = "";
        }
        HttpNotificationDirectiveController.prototype.httpStart = function (event) {
            this.scope.showWaiting = true;
        };

        HttpNotificationDirectiveController.prototype.httpEnd = function (event) {
            this.scope.showWaiting = false;
        };

        HttpNotificationDirectiveController.prototype.httpError = function (event, resObj) {
            this.scope.showWaiting = false;
            this.scope.showError = true;
            this.scope.errorMessage = resObj.data.ExceptionMessage;
        };
        return HttpNotificationDirectiveController;
    })();

    angular.module("dbexplorer").directive("httpNotification", function () {
        return {
            controller: ["$scope", "$rootScope", HttpNotificationDirectiveController],
            scope: {},
            templateUrl: "/client/views/directives/httpNotification.html"
        };
    });
})(dbExplorerApp || (dbExplorerApp = {}));
//# sourceMappingURL=httpNotification.js.map
