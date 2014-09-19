(function() {
    "use strict";

    var shellService = angular.module('shell', ['api', 'util' ]);
    shellService.factory('shell', ['api', 'util', function (api, util) {
        var shell = {
            server: null,
            databases:null,
            database: null,
            table: null,
            shellScope: null,

            setServer: function (server, next) {
                if (server == this.server) {
                    next();
                } else {
                    this.server = server;
                    this.shellScope.safeServerName = util.sanitizeServerName(server);
                    api.getDatabases(this, function (databases) {
                        console.dir(databases);
                        this.databases = databases;
                        next();
                    }.bind(this));
                }
            },

            setDatabase:function(databaseName, next) {
                if (this.database &&  databaseName == this.database.Name) {
                  next();
              } else {
                    api.getDatabaseDetails(this, function(database) {
                        this.database = database;
                        next();
                    }.bind(this));
                }
            },


            initializeFromRoute: function($routeParams, next) {
                if ($routeParams.server) {
                    this.setServer(util.unSanitizeServerName($routeParams.server), function() {
                        if ($routeParams.database) {

                        } else {
                            next();
                        }
                    }.bind(this));
                } else {
                    next();
                }
            }


            
        }


        return shell;

    }]);


    angular.module('util', []).factory('util', [function() {
        return {
            sanitizeServerName:function(name) {
                return name.replace("\\", "-");
            },
            unSanitizeServerName:function(name) {
                return name.replace("-", "\\");
            }

        }
    }]);

})();