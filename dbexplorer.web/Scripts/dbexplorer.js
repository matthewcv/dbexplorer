(function () {

    var shellService = angular.module('shell', []);
    shellService.factory('shell', function() {
        var shell = {
            server: 'SRV_DEV_TRANS\\SMGTRANS',
            database: null,
            breadcrumbs: [],
            shellScope:null,
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

                apiGet: function (url, haveData) {

                    if (this.cache[url]) {
                        haveData(this.cache[url]);
                    } else {
                        var that = this;
                        $http.get(url).then(function (response) {
                            that.cache[url] = response.data;
                            haveData(that.cache[url]);
                        }, function(err) {
                            console.dir(err);
                        });
                    }
                }
            }

            return new ApiService();
        }
    ]);

    var app = angular.module('dbexplorer', ['shell', 'api']);

    app.directive('aClick', ["$parse",
        function ($parse) {
            return {
                compile: function ($element, attr) {
                    var fn = $parse(attr['aClick']);
                    return function(scope, element, attr) {
                        element.on('click', function (ev) {
                            ev.preventDefault();
                            scope.$apply(function() {
                                fn(scope, { $event: ev });
                            })
                        });
                    }
                }
            };
        }
    ]);


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


            $scope.details = function() {
                
            }

            $scope.data = function(table) {
                shell.pushBreadcrumb({}, { name: table.Name + ' data', table: table, view: 'tableData' });
            }
        }
    ]);

    app.controller('TableDataController', ['$scope', 'api', 'shell',
        function ($scope, api, shell) {
            var b = shell.currentBreadcrumb();

            console.dir(b);
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