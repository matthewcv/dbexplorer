module dbExplorerApp {

    class DatabaseController {
        constructor(private $scope: DatabaseTablesScope, private $http: ng.IHttpService, private appState:ApplicationState, private stateParams:ng.ui.IStateParamsService) {

            console.dir(stateParams);
            $http.get("/Db", {params:stateParams} ).then((d) => {
                console.dir(d);
            });

            
        }
    }

    interface DatabaseTablesScope extends HasDbInfo {

    }

    angular.module("dbexplorer").controller("DatabaseController", ["$scope", "$http", "applicationState","$stateParams",DatabaseController]);
}  