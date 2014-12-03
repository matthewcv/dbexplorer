

module dbExplorerApp {

    
    angular.module("dbexplorer", ['ui.router'])

        .config(["$stateProvider", "$locationProvider", "$httpProvider", function ($stateProvider: ng.ui.IStateProvider, $locationProvider: ng.ILocationProvider, httpProvider:ng.IHttpProvider) {
            $locationProvider.html5Mode(true);

                httpProvider.interceptors.push("httpIntercepter");
            $stateProvider.state("needDatabase", {
                url:"/",
                templateUrl: "/client/views/SelectDatabase.html"
               
            });

            $stateProvider.state("Db", {
                templateUrl: "/client/views/Database.html",
                url: "/Db?server&database"
                
            });


        }])
        .constant("applicationState", {
            knownServers:[]        
        })  
        .factory("httpIntercepter", ["$q","$rootScope", (q:ng.IQService, root:ng.IRootScopeService) => {
            
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
                    return q.reject( rejection);
                }
            };
        }])

    ;

    export interface ApplicationState {
        currentServer: Server
        knownServers:Server[];
        currentDatabase: Database
    }

    export interface Server {
        Name: string
        Databases: Database[]
    }

    export interface Database {
        Name:string
    }

    export class Events {
        static databaseSelected = 'database-selected'
        static httpStart = 'http-request-start'
        static httpEnd = 'http-request-end'
        static httpError = 'http-request-error'
    }

    

}