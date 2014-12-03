module dbExplorerApp {

    class SelectDatabaseController {
        constructor(private $scope: SelectDatabaseScope, private $http: ng.IHttpService, private state:ApplicationState) {
            $scope.selectDatabase = this.selectDatabase.bind(this);
            $scope.selectServer = this.selectServer.bind(this);
            $scope.dbInfo.server = "srv_dev_report\\smgreport";
        }

        selectServer():void {
            this.$http.get("/Server", { params: { serverName: this.$scope.dbInfo.server } }).success((data: Server) => {

                this.state.knownServers.push(data);
                this.state.currentServer = data;
                this.$scope.dbInfo.dbList = data.Databases.map((d) => { return d.Name; }); 

            });

        }

        selectDatabase(dbName:string): void {
            this.state.currentDatabase = this.state.currentServer.Databases.reduce((p, c, i, s) => {
                
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
            this.$scope.$emit(Events.databaseSelected, this.$scope.dbInfo);
        }
    }

    interface SelectDatabaseScope extends HasDbInfo {

        selectDatabase(): void
        selectServer(): void
    }

    angular.module("dbexplorer").controller("SelectDatabaseController", ["$scope", "$http", "applicationState", SelectDatabaseController]);

}  