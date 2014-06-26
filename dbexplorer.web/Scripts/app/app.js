(function () {
    "use strict";


    var app = angular.module('dbexplorer', ['shell', 'api', 'pagerDirective']);




    app.controller('DbListController', ['$scope', 'api', 'shell',
        function ($scope, api, shell) {
            console.log('DbListController');

            api.getDatabases(function(databases) {

                $scope.databases = databases;

            });

            $scope.dbDetails = function (db) {

                
                shell.database = db;
                shell.pushBreadcrumb({},{ name: db.Name, db: db, view: 'dbDetails' });
                
            };

            
        }
    ]);

    app.controller('DbDetailsController', ['$scope', 'api', 'shell',
        function($scope, api, shell) {
            console.log('DbDetailsController');
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
            console.log('TableDataController');

            var b = shell.currentBreadcrumb();
            console.dir(b.table);
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


    app.controller('ShellController', ['$scope', 'shell',
        function ($scope, shell) {
            console.log('ShellController');
            $scope.server =shell.server ;
            $scope.view = shell.breadcrumbs[0].view;
            $scope.breadcrumbs = shell.breadcrumbs;

            shell.shellScope = $scope;

            $scope.breadCrumbNav = function(b) {
                
                $scope.view = b.view;
                shell.popBreadcrumbs(b);

            }


        }
    ]);


})();