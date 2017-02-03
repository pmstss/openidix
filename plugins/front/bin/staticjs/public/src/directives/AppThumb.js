module.exports = function(app) {
  return app.directive('appthumb', [
    "$rootScope", function($rootScope) {
      return {
        restrict: 'AE',
        templateUrl: '/templates/apps/thumb.html',
        replace: true,
        scope: {
          app: '='
        },
        link: function($scope, $element) {}
      };
    }
  ]);
};
