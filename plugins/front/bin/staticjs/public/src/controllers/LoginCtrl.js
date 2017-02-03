module.exports = function(app) {
  return app.controller('LoginCtrl', [
    '$state', '$scope', '$rootScope', '$location', 'UserService', function($state, $scope, $rootScope, $location, UserService) {
      var initCtrl, login;
      initCtrl = function() {
        $scope.error = void 0;
        $scope.user = {};
        return $('#emailInput').focus();
      };
      login = function(cb) {
        return UserService.login({
          email: $scope.user.email,
          pass: $scope.user.pass
        }).then(function(user) {
          $state.go('dashboard.home');
        }).fail(function(e) {
          $scope.error = e;
          $scope.$apply();
        })["finally"](function() {
          return cb(null);
        });
      };
      $scope.submit = function(form) {
        if (form.$name === "loginForm") {
          $scope.loginSubmitted = true;
        }
        if (form.$invalid) {
          return;
        }
        return login(function(cb) {
          return $scope.loginSubmitted = false;
        });
      };
      return initCtrl();
    }
  ]);
};
