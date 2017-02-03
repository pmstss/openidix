var Q;

Q = require('q');

module.exports = function(app) {
  return app.factory('PluginService', [
    '$http', '$rootScope', '$location', function($http, $rootScope, $location) {
      var api, plugin_service;
      api = require('../utilities/apiCaller')($http, $rootScope);
      plugin_service = {
        getAll: function() {
          var defer;
          defer = Q.defer();
          api("/plugins", function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          });
          return defer.promise;
        },
        get: function(name) {
          var defer;
          defer = Q.defer();
          api("/plugins/" + name, (function(data) {
            defer.resolve(data.data);
          }), function(e) {
            defer.reject(e);
          });
          return defer.promise;
        }
      };
      return plugin_service;
    }
  ]);
};
