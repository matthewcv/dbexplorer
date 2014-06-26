(function () {
    "use strict";

    var apiService = angular.module('api', []);

    apiService.factory('api', ['shell', '$http',
        function (shell, $http) {

            function clean(part) {
                return part.replace("\\", "-");
            }

            function ApiService() {

            }
            ApiService.prototype = {
                cache: {},

                getDatabases: function (haveDatabases) {
                    this.apiGet("/Db/Databases/" + clean(shell.server), haveDatabases);
                },

                getDatabaseDetails: function (haveData) {
                    this.apiGet("/Db/DatabaseDetails/" + clean(shell.server) + "/" + shell.database.Name, haveData);
                },

                getTableData: function (scope) {
                    var options = encodeURIComponent(angular.toJson(scope.tableDataOptions));
                    console.log(options);
                    $http.get("/Db/TableData/" + clean(shell.server) + "/" + shell.database.Name + "/" + shell.table.Name + "?options=" + options)
                        .then(function (response) {

                            scope.data = response.data;
                        },
                        this.apiError.bind(this));
                },

                apiError: function (err) {
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

})();