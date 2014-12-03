var dbExplorerApp;
(function (dbExplorerApp) {
    var DatabaseController = (function () {
        function DatabaseController($scope, $http, appState, stateParams) {
            this.$scope = $scope;
            this.$http = $http;
            this.appState = appState;
            this.stateParams = stateParams;
            console.dir(stateParams);
            $http.get("/Db", { params: stateParams }).then(function (d) {
                console.dir(d);
            });
        }
        return DatabaseController;
    })();

    angular.module("dbexplorer").controller("DatabaseController", ["$scope", "$http", "applicationState", "$stateParams", DatabaseController]);
})(dbExplorerApp || (dbExplorerApp = {}));
//# sourceMappingURL=database.js.map
