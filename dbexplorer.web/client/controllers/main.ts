

module dbExplorerApp {
    

    ///this is the main controller
    class Main {
        constructor(private $scope: MainScope, private  $state:ng.ui.IStateService, private http:ng.IHttpService, private appState:ApplicationState) {

            $scope.title = "check out your DB Explorer";

            
            
            $scope.dbInfo = {  };

            $scope.$on(Events.databaseSelected, this.onDatabaseSelected.bind(this));

            $scope.changeDatabase = this.changeDatabase.bind(this);

            this.changeDatabase();
        }


        onDatabaseSelected(ev: ng.IAngularEvent) {
            this.$state.go("Db", { server: this.appState.currentServer.Name, database:this.appState.currentDatabase.Name});
        }

        changeDatabase(): void {
            this.$state.go("needDatabase");
        }

    }

    export interface HasDbInfo extends ng.IScope {
        dbInfo: DbInfo;
        
    }

    interface MainScope extends HasDbInfo {
        title: string;
        theCurrentView: string;
        selectDatabase(): void;
        changeDatabase(): void;
    }

    export interface DbInfo {
        server?:string
        database?: string
        dbList?:string[]
    }
    
    angular.module("dbexplorer").controller("MainController", ["$scope","$state","$http","applicationState",Main]);

}
