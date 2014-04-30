(function () {

    var shellService = angular.module('shell', []);
    shellService.factory('shell', function() {
        return {
            server: 'SRV_DEV_TRANS\\SMGTRANS'
        }
    });

    var apiService = angular.module('api', []);

    apiService.factory('api', ['shell', '$http',
        function (shell, $http) {

            function clean(part) {
                return part.replace("\\", "-");
            }

            return {
                getDatabases:function(haveDatabases) {
                    $http.get("/Db/Databases/" + clean(shell.server)).then(function(response) {
                        haveDatabases(response.data);
                    }, function() {
                        console.dir(arguments);
                    });
                }
            }
        }
    ]);

    var app = angular.module('dbexplorer', ['shell', 'api']);

    app.controller('DbListController', ['$scope', 'api',
        function ($scope, api) {
            api.getDatabases(function (databases) {
                
                $scope.databases = databases;
                
            })
            
        }
    ]);


    app.controller('ShellController', ['$scope', 'shell',
        function ($scope, shell) {
            $scope.server =shell.server ;

            $scope.$watch('server', function() {
                shell.server = $scope.server;
            });

            $scope.serverDetails = function () {
                
                
                
            };
        }
    ]);


})();