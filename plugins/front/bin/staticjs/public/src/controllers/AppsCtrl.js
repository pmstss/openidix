module.exports = function(app) {
  return app.controller('AppsCtrl', [
    '$state', '$scope', '$rootScope', '$location', function($state, $scope, $rootScope, $location, UserService) {
      $scope.setApp = function(app) {
        return $scope.app = app;
      };
      $scope.getApp = function() {
        return $scope.app;
      };
      $scope.setProvider = function(provider) {
        return $scope.provider_name = provider;
      };
      $scope.setTitle = function(title) {
        return $scope.pagetitle = title;
      };
      $scope.clearArianne = function() {
        $scope.app = void 0;
        return $scope.provider_name = void 0;
      };
      return $scope.appModified = function(v) {
        return $scope.app_changed = v;
      };
    }
  ]);
};
