var dbExplorerApp;
(function (dbExplorerApp) {
    var DatabaseTablesController = (function () {
        function DatabaseTablesController($scope, $http) {
            this.$scope = $scope;
            $http.get("/Db").then(function (d) {
                console.dir(d);
            });
        }
        return DatabaseTablesController;
    })();

    angular.module("dbexplorer").directive("databaseTables", function () {
        return {
            controller: ["$scope", "$http", DatabaseTablesController],
            templateUrl: "/client/views/directives/DatabaseTables.html"
        };
    });
})(dbExplorerApp || (dbExplorerApp = {}));
//# sourceMappingURL=databaseTables.js.map
