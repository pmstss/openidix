var Q;

Q = require('q');

module.exports = function(app) {
  return app.factory('ConfigService', [
    '$http', '$rootScope', '$location', function($http, $rootScope, $location) {
      var api, config_service;
      api = require('../utilities/apiCaller')($http, $rootScope);
      config_service = {
        getConfig: function() {
          var defer;
          defer = Q.defer();
          api("/config", (function(data) {
            defer.resolve(data.data);
          }), function(e) {
            defer.reject(e);
          });
          return defer.promise;
        }
      };
      return config_service;
    }
  ]);
};
