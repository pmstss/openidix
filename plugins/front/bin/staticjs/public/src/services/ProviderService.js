var Q;

Q = require("q");

module.exports = function(app) {
  app.factory("ProviderService", [
    "$rootScope", "$http", function($rootScope, $http) {
      var api, get_provider_conf, get_provider_settings, provider_service;
      api = require("../utilities/apiCaller")($http, $rootScope);
      get_provider_conf = function(name) {
        var defer;
        defer = Q.defer();
        api("/providers/" + name + "?extend=true", (function(data) {
          defer.resolve(data.data);
        }), function(e) {
          defer.reject(e);
        });
        return defer.promise;
      };
      get_provider_settings = function(name) {
        var defer;
        defer = Q.defer();
        api("/providers/" + name + "/settings", (function(data) {
          defer.resolve(data.data.settings);
        }), function(e) {
          defer.reject(e);
        });
        return defer.promise;
      };
      provider_service = {
        getAll: function() {
          var defer;
          defer = Q.defer();
          api("/providers", function(data) {
            return defer.resolve(data.data);
          }, function(e) {
            return defer.reject(e);
          });
          return defer.promise;
        },
        get: function(name) {
          return get_provider_conf(name);
        },
        getSettings: function(name) {
          return get_provider_settings(name);
        },
        getCurrentProvider: function() {
          return get_provider_conf($rootScope.wd.provider);
        },
        getCurrentProviderSettings: function() {
          return get_provider_settings($rootScope.wd.provider);
        },
        getProviderConfig: function(name) {
          return get_provider_conf(name);
        },
        getProviderSettings: function(name) {
          return get_provider_settings(name);
        }
      };
      return provider_service;
    }
  ]);
};
