var dbExplorerApp;
(function (dbExplorerApp) {
    ///this is the main controller
    var Main = (function () {
        function Main($scope, $state, http, appState) {
            this.$scope = $scope;
            this.$state = $state;
            this.http = http;
            this.appState = appState;
            $scope.title = "check out your DB Explorer";

            $scope.dbInfo = {};

            $scope.$on(dbExplorerApp.Events.databaseSelected, this.onDatabaseSelected.bind(this));

            $scope.changeDatabase = this.changeDatabase.bind(this);

            this.changeDatabase();
        }
        Main.prototype.onDatabaseSelected = function (ev) {
            this.$state.go("Db", { server: this.appState.currentServer.Name, database: this.appState.currentDatabase.Name });
        };

        Main.prototype.changeDatabase = function () {
            this.$state.go("needDatabase");
        };
        return Main;
    })();

    angular.module("dbexplorer").controller("MainController", ["$scope", "$state", "$http", "applicationState", Main]);
})(dbExplorerApp || (dbExplorerApp = {}));
//# sourceMappingURL=main.js.map
