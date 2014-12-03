var dbExplorerApp;
(function (dbExplorerApp) {
    var SelectDatabaseController = (function () {
        function SelectDatabaseController($scope, $http, state) {
            this.$scope = $scope;
            this.$http = $http;
            this.state = state;
            $scope.selectDatabase = this.selectDatabase.bind(this);
            $scope.selectServer = this.selectServer.bind(this);
            $scope.dbInfo.server = "srv_dev_report\\smgreport";
        }
        SelectDatabaseController.prototype.selectServer = function () {
            var _this = this;
            this.$http.get("/Server", { params: { serverName: this.$scope.dbInfo.server } }).success(function (data) {
                _this.state.knownServers.push(data);
                _this.state.currentServer = data;
                _this.$scope.dbInfo.dbList = data.Databases.map(function (d) {
                    return d.Name;
                });
            });
        };

        SelectDatabaseController.prototype.selectDatabase = function (dbName) {
            this.state.currentDatabase = this.state.currentServer.Databases.reduce(function (p, c, i, s) {
                if (p.Name == dbName) {
                    return p;
                }
                if (c.Name == dbName) {
                    return c;
                }
                return c;
            });
            if (this.state.currentDatabase) {
                this.$scope.dbInfo.database = this.state.currentDatabase.Name;
            }
            this.$scope.$emit(dbExplorerApp.Events.databaseSelected, this.$scope.dbInfo);
        };
        return SelectDatabaseController;
    })();

    angular.module("dbexplorer").controller("SelectDatabaseController", ["$scope", "$http", "applicationState", SelectDatabaseController]);
})(dbExplorerApp || (dbExplorerApp = {}));
//# sourceMappingURL=selectDatabase.js.map
