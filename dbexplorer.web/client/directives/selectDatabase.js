var dbExplorerApp;
(function (dbExplorerApp) {
    var SelectDatabaseController = (function () {
        function SelectDatabaseController($scope, $http) {
            this.$scope = $scope;
            this.$http = $http;
            $scope.selectDatabase = this.selectDatabase.bind(this);
        }
        SelectDatabaseController.prototype.selectDatabase = function () {
            this.$http.defaults.headers.common['selected-database'] = this.$scope.dbInfo.database;
            this.$scope.$emit(dbExplorerApp.Events.databaseSelected, this.$scope.dbInfo);
        };
        return SelectDatabaseController;
    })();

    angular.module("dbexplorer").directive("selectDatabase", function () {
        return {
            controller: ["$scope", "$http", SelectDatabaseController],
            templateUrl: "/client/views/directives/SelectDatabase.html"
        };
    });
})(dbExplorerApp || (dbExplorerApp = {}));
//# sourceMappingURL=selectDatabase.js.map
