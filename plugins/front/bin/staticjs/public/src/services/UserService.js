var Q;

Q = require('q');

module.exports = function(app) {
  return app.factory('UserService', [
    '$http', '$rootScope', '$location', function($http, $rootScope, $location) {
      var api, user_service;
      api = require('../utilities/apiCaller')($http, $rootScope);
      user_service = {
        login: function(user) {
          var authorization, defer;
          defer = Q.defer();
          authorization = window.btoa((user != null ? user.email : void 0) + ':' + (user != null ? user.pass : void 0));
          $http({
            method: 'POST',
            url: '/signin',
            data: {
              name: user.email,
              pass: user.pass
            }
          }).success(function(data) {
            data = data.data;
            $rootScope.accessToken = data.accessToken;
            $rootScope.loginData = {
              token: data.accessToken,
              expires: data.expires
            };
            return defer.resolve(data);
          }).error(function(e) {
            return defer.reject(e);
          });
          return defer.promise;
        },
        loggedIn: function() {
          return $rootScope.wd.oauthio !== void 0 && $rootScope.wd.oauthio.access_token !== void 0;
        },
        logout: function() {
          $rootScope.logged_user = void 0;
          $rootScope.accessToken = void 0;
          return $location.path('/login');
        }
      };
      return user_service;
    }
  ]);
};
