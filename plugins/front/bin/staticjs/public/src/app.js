var app;

app = angular.module("oauthd", ["ui.router", 'ui.bootstrap']).config([
  "$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: '/templates/login.html',
      controller: 'LoginCtrl'
    });
    $stateProvider.state('dashboard', {
      url: '/',
      templateUrl: '/templates/dashboard.html',
      controller: 'DashboardCtrl'
    });
    $stateProvider.state('dashboard.home', {
      url: 'home',
      templateUrl: '/templates/dashboard/home.html',
      controller: 'HomeCtrl'
    });
    $stateProvider.state('dashboard.apps', {
      url: 'apps',
      abstract: true,
      templateUrl: '/templates/apps.html',
      controller: 'AppsCtrl'
    });
    $stateProvider.state('dashboard.apps.create', {
      url: '/new',
      templateUrl: '/templates/app-create.html',
      controller: 'AppCreateCtrl'
    });
    $stateProvider.state('dashboard.apps.all', {
      url: '/all',
      templateUrl: '/templates/apps-list.html',
      controller: 'AppsIndexCtrl'
    });
    $stateProvider.state('dashboard.apps.show', {
      url: '/:key',
      templateUrl: '/templates/app-show.html',
      controller: 'AppShowCtrl'
    });
    $stateProvider.state('dashboard.apps.new_keyset', {
      url: '/:key/addProvider',
      templateUrl: '/templates/app-new-keyset.html',
      controller: 'AppProviderListCtrl'
    });
    $stateProvider.state('dashboard.apps.keyset', {
      url: '/:key/:provider',
      templateUrl: '/templates/app-keyset.html',
      controller: 'AppKeysetCtrl'
    });
    $stateProvider.state('dashboard.plugins', {
      url: 'plugins/:plugin',
      templateUrl: '/templates/plugins/show.html',
      controller: 'PluginShowCtrl'
    });
    $stateProvider.state('dashboard.help', {
      url: 'help',
      templateUrl: '/templates/help.html',
      controller: 'HelpCtrl'
    });
    $urlRouterProvider.when("", "dashboard.home");
    $urlRouterProvider.otherwise('/login');
    return $locationProvider.html5Mode(true);
  }
]);

require('./filters/filters')(app);

require('./directives/DomainsDir')(app);

require('./directives/KeysetDir')(app);

require('./directives/AppThumb')(app);

require('./services/AppService')(app);

require('./services/KeysetService')(app);

require('./services/PluginService')(app);

require('./services/ProviderService')(app);

require('./services/UserService')(app);

require('./services/ConfigService')(app);

require('./controllers/DashboardCtrl')(app);

require('./controllers/HomeCtrl')(app);

require('./controllers/LoginCtrl')(app);

require('./controllers/AppsCtrl')(app);

require('./controllers/Apps/AppShowCtrl')(app);

require('./controllers/Apps/AppCreateCtrl')(app);

require('./controllers/Apps/AppsIndexCtrl')(app);

require('./controllers/Apps/AppKeysetCtrl')(app);

require('./controllers/Apps/AppTryModalCtrl')(app);

require('./controllers/Apps/AppProviderListCtrl')(app);

require('./controllers/HelpCtrl')(app);

require('./controllers/Plugins/PluginShowCtrl')(app);

app.run([
  "$rootScope", "UserService", function($rootScope, UserService) {
    window.scope = $rootScope;
    $rootScope.loading = true;
    $rootScope.logged_user = amplify.store('user');
    $rootScope.accessToken = amplify.store('accessToken');
    $rootScope.loginData = amplify.store('loginData');
    $rootScope.$watch('logged_user', function() {
      if (($rootScope.logged_user != null)) {
        return amplify.store('user', $rootScope.logged_user);
      } else {
        return amplify.store('user', null);
      }
    });
    $rootScope.$watch('accessToken', function() {
      if (($rootScope.accessToken != null)) {
        return amplify.store('accessToken', $rootScope.accessToken);
      } else {
        return amplify.store('accessToken', null);
      }
    });
    $rootScope.$watch('loginData', function() {
      if (($rootScope.loginData != null)) {
        return amplify.store('loginData', $rootScope.loginData);
      } else {
        return amplify.store('loginData', null);
      }
    });
    return $rootScope.logout = function() {
      return UserService.logout();
    };
  }
]);
