var Q;

Q = require('q');

module.exports = function(app) {
  return app.factory('KeysetService', [
    '$rootScope', '$http', function($rootScope, $http) {
      var api, keyset_service;
      api = require('../utilities/apiCaller')($http, $rootScope);
      keyset_service = {
        get: function(app_key, provider) {
          var defer;
          defer = Q.defer();
          api('/apps/' + app_key + '/keysets/' + provider, function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          });
          return defer.promise;
        },
        save: function(app_key, provider, keyset) {
          var defer;
          defer = Q.defer();
          api('/apps/' + app_key + '/keysets/' + provider, function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          }, {
            data: {
              parameters: keyset,
              response_type: 'token'
            }
          });
          return defer.promise;
        },
        del: function(app_key, provider) {
          var defer;
          defer = Q.defer();
          api('/apps/' + app_key + '/keysets/' + provider, function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          }, {
            method: 'DELETE'
          });
          return defer.promise;
        }
      };
      return keyset_service;
    }
  ]);
};
