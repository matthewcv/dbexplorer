(function () {
    "use strict";


    var app = angular.module('dbexplorer', ['shell', 'api', 'util', 'mcvDirectives', 'ngRoute']);

    app.config(['$routeProvider', '$locationProvider', 
        function ($routeProvider, $locationProvider) {
            $locationProvider.html5Mode(true);

            function getroute(controller) {
                return {
                    controller: controller,
                    template: function (parms) {

                        return document.querySelector("script[data-controller=" + controller + "]").innerHTML;
                    }
                }
            }


            $routeProvider.when("/", getroute('DbListController'));
            $routeProvider.when("/:server", getroute('DbListController'));

            $routeProvider.when("/:server/:database", getroute('DbDetailsController'));
        }
    ]);



    app.controller('DbListController', ['$scope', 'api', 'shell', 'util','$routeParams','$location',
        function ($scope, api, shell,util, $routeParams, $location) {
            console.log('DbListController');
            console.dir($routeParams);


            shell.initializeFromRoute($routeParams, function() {
                $scope.databases = shell.databases;
                $scope.server = shell.server;
            });
            

            $scope.setServer = function () {
                console.dir('server: ' + $scope.server);
                $location.url(util.sanitizeServerName($scope.server));
            }

            
        }
    ]);

    app.controller('DbDetailsController', ['$scope', 'api', 'shell','$routeParams','$location',
        function($scope, api, shell, $routeParams, $location) {
            console.log('DbDetailsController');
           console.dir($routeParams);


            api.getDatabaseDetails(function(dbdetails) {
                $scope.databaseDetails = dbdetails;
            });


            $scope.tableData = function (table) {
                shell.table = table;
                shell.pushBreadcrumb({}, { name: table.Name, table: table, view: 'tableData' });
            }
        }
    ]);

    app.controller('TableDataController', ['$scope', 'api', 'shell',
        function ($scope, api, shell) {
          //  console.log('TableDataController');

            var b = shell.currentBreadcrumb();
          //  console.dir(b.table);
            $scope.table = b.table;

            $scope.tableDataOptions = { Page: 1, PageSize: 10 };

            $scope.getData = function () {
                api.getTableData($scope);
            };


            $scope.referenceTo = function (row, ref) {
                console.dir([shell,row, ref]);
                //var refTable = $.grep(shell.database.Tables, function(t) {
                //    return t.Name == ref.PkTableName && t.schema == ref.PkTableSchema;
                //})[0];
                
                //shell.pushBreadcrumb({},{name: })
                //console.dir(refTable);
            }

            api.getTableData($scope);
        }
    ]);


    app.controller('ShellController', ['$scope', 'shell','$routeParams',
        function ($scope, shell, $routeParams) {
        //    console.log('ShellController');
            $scope.server =shell.server ;
            $scope.safeServerName = null;

            shell.shellScope = $scope;

        //    console.dir($routeParams);//none here.  Probably because the route didn't invoke this controller.

        }
    ]);


})();