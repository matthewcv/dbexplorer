(function () {
    "use strict";

    var apiService = angular.module('api', ['util']);

    apiService.factory('api', ['$http','util',
        function ($http, util) {


            function ApiService() {

            }
            ApiService.prototype = {
                cache: {},

                getDatabases: function (shell,haveDatabases) {
                    this.apiGet("/Db/Databases/" + shell.shellScope.safeServerName, haveDatabases);
                },

                getDatabaseDetails: function (shell,haveData) {
                    this.apiGet("/Db/DatabaseDetails/" + shell.shellScope.safeServerName + "/" + shell.database.Name, haveData);
                },

                getTableData: function (shell, haveData) {
                    var options = encodeURIComponent(angular.toJson(scope.tableDataOptions));
                    console.log(options);
                    $http.get("/Db/TableData/" + shell.shellScope.safeServerName + "/" + shell.database.Name + "/" + shell.table.Name + "?options=" + options)
                        .then(function (response) {

                            haveData( response.data);
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