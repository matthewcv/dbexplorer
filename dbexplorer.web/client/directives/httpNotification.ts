module dbExplorerApp {

    class HttpNotificationDirectiveController {
        constructor(private scope: iScope, root:ng.IRootScopeService) {
            root.$on(Events.httpStart, this.httpStart.bind(this));
            root.$on(Events.httpEnd, this.httpEnd.bind(this));
            root.$on(Events.httpError, this.httpError.bind(this));

            scope.showWaiting = false;
            scope.showError = false;
            scope.errorMessage = "";
        }

        httpStart(event:ng.IAngularEvent): void {
            this.scope.showWaiting = true;
        }

        httpEnd(event: ng.IAngularEvent): void {
            this.scope.showWaiting = false;
        }

        httpError(event: ng.IAngularEvent, resObj): void {
            this.scope.showWaiting = false;
            this.scope.showError = true;
            this.scope.errorMessage = resObj.data.ExceptionMessage;
        }
    }

    interface iScope extends ng.IScope {
        showWaiting: boolean;
        showError: boolean;
        errorMessage: string
    }
    

    
    angular.module("dbexplorer").directive("httpNotification", () => {
        return {
            controller: ["$scope","$rootScope", HttpNotificationDirectiveController],
            scope:{},
            templateUrl: "/client/views/directives/httpNotification.html"
        }
    });
}  