(function () {

    var shellService = angular.module('shell', []);
    shellService.factory('shell', function() {
        var shell = {
            server: 'SRV_DEV_TRANS\\SMGTRANS',
            database: null,
            table: null,
            breadcrumbs: [],
            shellScope: null,
            tableDataOptions:{Page:1,PageSize:10},
            popBreadcrumbs: function(b) {
                var i = this.breadcrumbs.indexOf(b);
                this.breadcrumbs.splice(i + 1, this.breadcrumbs.length);
            },
            pushBreadcrumb:function(currentState, nextState) {
                var current = this.breadcrumbs[this.breadcrumbs.length - 1];
                angular.extend(current, currentState);
                this.breadcrumbs.push(nextState);
                this.shellScope.view = nextState.view;
            },
            currentBreadcrumb:function() {
                return this.breadcrumbs[this.breadcrumbs.length - 1];
            }
        }
        shell.breadcrumbs.push({ name: shell.server, view:"dbList" });

        
        return shell;

    });

    var apiService = angular.module('api', []);

    apiService.factory('api', ['shell', '$http',
        function (shell, $http) {

            function clean(part) {
                return part.replace("\\", "-");
            }

            function ApiService() {
                
            }
            ApiService.prototype = {
                cache:{},

                getDatabases: function (haveDatabases) {
                    this.apiGet("/Db/Databases/" + clean(shell.server), haveDatabases);
                },

                getDatabaseDetails: function(haveData) {
                    this.apiGet("/Db/DatabaseDetails/" + clean(shell.server) + "/" + shell.database.Name, haveData);
                },

                getTableData: function (scope) {
                    var options = encodeURIComponent( angular.toJson(shell.tableDataOptions));
                    console.log(options);
                    $http.get("/Db/TableData/" + clean(shell.server) + "/" + shell.database.Name + "/" + shell.table.Name + "?options=" + options)
                        .then(function (response) {

                            scope.data = response.data;
                        },
                        this.apiError.bind(this));
                },

                apiError:function(err) {
                    console.dir(err);
                },

                apiGet: function (url, haveData) {

                    if (this.cache[url]) {
                        haveData(this.cache[url]);
                    } else {
                        var that = this;
                        $http.get(url).then(function (response) {
                            that.cache[url] = response.data;
                            haveData(that.cache[url]);
                        }, this.apiError.bind(this));
                    }
                }
            }

            return new ApiService();
        }
    ]);

    var app = angular.module('dbexplorer', ['shell', 'api']);




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
            api.getTableData($scope);

            var b = shell.currentBreadcrumb();
            console.dir(b.table);
            $scope.table = b.table;

            $scope.pageLeft = function() {
                if (shell.tableDataOptions.Page > 1) {
                    shell.tableDataOptions.Page--;
                    api.getTableData($scope);
                }
            };

            $scope.pageRight = function() {
                shell.tableDataOptions.Page++;
                api.getTableData($scope);
            };

            $scope.referenceTo = function (row, ref) {
                console.dir(shell);
                //var refTable = $.grep(shell.database.Tables, function(t) {
                //    return t.Name == ref.PkTableName && t.schema == ref.PkTableSchema;
                //})[0];
                
                //shell.pushBreadcrumb({},{name: })
                console.dir(refTable);
            }
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