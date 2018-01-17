var _ = require('underscore')
  , angular = require('angular');

/* Fix for IE */
if (!Date.now) { Date.now = function() { return +(new Date); }; }

angular
  .module('mage')
  .controller('FilterController', require('./filter/filter'))
  .controller('NavController', require('./mage/mage-nav.controller'))
  .controller('MageController', require('./mage/mage.controller'))
  .controller('ExportController', require('./export/export'))
  .controller('SigninController', require('./signin/signin.controller'))
  .controller('SignupController', require('./signup/signup.controller'))
  .controller('UserController', require('./user/user.controller'))
  .controller('AboutController', require('./about/about.controller'))
  .controller('DisclaimerController', require('./disclaimer/disclaimer.controller'))
  .config(config)
  .run(run);

require('./factories');
require('./filters');
require('./leaflet-extensions');
require('./mage');
require('./observation');
require('./user');
require('./admin');

config.$inject = ['$provide', '$httpProvider', '$routeProvider', '$animateProvider'];

function config($provide, $httpProvider, $routeProvider, $animateProvider) {
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.post  = {'Content-Type': 'application/x-www-form-urlencoded'};

  $animateProvider.classNameFilter(/ng-animatable/);

  function resolveLogin() {
    return {
      user: ['UserService', function(UserService) {
        return UserService.getMyself();
      }]
    };
  }

  function resolveAdmin() {
    return {
      user: ['$q', 'UserService', function($q, UserService) {
        var deferred = $q.defer();

        UserService.getMyself().then(function(myself) {
          // TODO don't just check for these 2 roles
          myself.role.name === 'ADMIN_ROLE' || myself.role.name === 'EVENT_MANAGER_ROLE' ? deferred.resolve(myself) : deferred.reject();
        });

        return deferred.promise;
      }]
    };
  }

  $routeProvider.otherwise({
    redirectTo: '/'
  });

  $routeProvider.when('/', {
    resolve: {
      api: ['$location', 'Api', function($location, Api) {
        Api.get(function(api) {
          if (api.initial) {
            $location.path('/setup');
          } else {
            $location.path('/signin');
          }
        });
      }]
    }
  });

  $routeProvider.when('/setup', {
    template: require('./setup/setup.html'),
    controller: 'SetupController',
    resolve: {
      api: ['$q', '$location', 'Api', function($q, $location, Api) {
        var deferred = $q.defer();
        Api.get(function(api) {
          if (!api.initial) {
            $location.path('/');
          } else {
            deferred.resolve(api);
          }
        });

        return deferred.promise;
      }]
    }
  });

  $routeProvider.when('/signin', {
    template: require('./signin/signin.html'),
    controller: 'SigninController',
    resolve: {
      api: ['$q', '$location', 'Api', function($q, $location, Api) {
        var deferred = $q.defer();
        Api.get(function(api) {
          if (api.initial) {
            $location.path('/setup');
          } else {
            deferred.resolve(api);
          }
        });

        return deferred.promise;
      }]
    }
  });

  $routeProvider.when('/signup', {
    template: require('./signup/signup.html'),
    controller: 'SignupController',
    resolve: {
      api: ['$q', '$location', 'Api', function($q, $location, Api) {
        var deferred = $q.defer();
        Api.get(function(api) {
          if (api.initial) {
            $location.path('/setup');
          } else {
            deferred.resolve(api);
          }
        });

        return deferred.promise;
      }]
    }
  });

  $routeProvider.when('/admin', {
    template: require('./admin/admin.html'),
    controller:  'AdminController',
    resolve: resolveAdmin()
  });

  // Admin user routes
  $routeProvider.when('/admin/users', {
    template: require('./admin/users/users.html'),
    controller: "AdminUsersController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/users/new', {
    template: require('./admin/users/user.edit.html'),
    controller: "AdminUserEditController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/users/bulk', {
    template: require('./admin/users/user.bulk.html'),
    controller: "AdminUserBulkController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/users/:userId/', {
    template: require('./admin/users/user.html'),
    controller: "AdminUserController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/users/:userId/edit', {
    template: require('./admin/users/user.edit.html'),
    controller: "AdminUserEditController",
    resolve: resolveAdmin()
  });

  // Admin team routes
  $routeProvider.when('/admin/teams', {
    template: require('./admin/teams/teams.html'),
    controller: "AdminTeamsController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/teams/new', {
    template: require('./admin/teams/team.edit.html'),
    controller: "AdminTeamEditController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/teams/:teamId/', {
    template: require('./admin/teams/team.html'),
    controller: "AdminTeamController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/teams/:teamId/edit', {
    template: require('./admin/teams/team.edit.html'),
    controller: "AdminTeamEditController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/teams/:teamId/access', {
    template: require('./admin/teams/team.access.html'),
    controller: "AdminTeamAccessController",
    resolve: resolveAdmin()
  });

  // Admin event routes
  $routeProvider.when('/admin/events', {
    template: require('./admin/events/events.html'),
    controller: "AdminEventsController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/events/new', {
    template: require('./admin/events/event.edit.html'),
    controller: "AdminEventEditController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/events/:eventId/', {
    template: require('./admin/events/event.html'),
    controller: "AdminEventController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/events/:eventId/edit', {
    template: require('./admin/events/event.edit.html'),
    controller: "AdminEventEditController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/events/:eventId/access', {
    template: require('./admin/events/event.access.html'),
    controller: "AdminEventAccessController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/events/:eventId/forms/new', {
    template: require('./admin/events/event.edit.form.html'),
    controller: "AdminEventEditFormController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/events/:eventId/forms/:formId', {
    template: require('./admin/events/event.edit.form.html'),
    controller: "AdminEventEditFormController",
    resolve: resolveAdmin()
  });

  // Admin device routes
  $routeProvider.when('/admin/devices', {
    template: require('./admin/devices/devices.html'),
    controller: "AdminDevicesController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/devices/new/', {
    template: require('./admin/devices/device.edit.html'),
    controller: "AdminDeviceEditController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/devices/:deviceId/', {
    template: require('./admin/devices/device.html'),
    controller: "AdminDeviceController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/devices/:deviceId/edit', {
    template: require('./admin/devices/device.edit.html'),
    controller: "AdminDeviceEditController",
    resolve: resolveAdmin()
  });

  // Admin layer routes
  $routeProvider.when('/admin/layers', {
    template: require('./admin/layers/layers.html'),
    controller: "AdminLayersController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/layers/new/', {
    template: require('./admin/layers/layer.edit.html'),
    controller: "AdminLayerEditController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/layers/:layerId/', {
    template: require('./admin/layers/layer.html'),
    controller: "AdminLayerController",
    resolve: resolveAdmin()
  });
  $routeProvider.when('/admin/layers/:layerId/edit', {
    template: require('./admin/layers/layer.edit.html'),
    controller: "AdminLayerEditController",
    resolve: resolveAdmin()
  });

  // Admin settings routes
  $routeProvider.when('/admin/settings', {
    template: require('./admin/settings/settings.html'),
    controller: "AdminSettingsController",
    resolve: resolveAdmin()
  });

  $routeProvider.when('/map', {
    template: require('./mage/mage.html'),
    controller: "MageController",
    resolve: resolveLogin()
  });
  $routeProvider.when('/user', {
    template: require("./user/user.html"),
    controller: "UserController",
    resolve: resolveLogin()
  });
  $routeProvider.when('/about', {
    template: require("./about/about.html"),
    controller: "AboutController",
    resolve: resolveLogin()
  });
}

run.$inject = ['$rootScope', '$route', '$uibModal', 'UserService', '$location', 'authService', 'LocalStorageService', 'Api'];

function run($rootScope, $route, $uibModal, UserService, $location, authService, LocalStorageService, Api) {
  $rootScope.$on('event:auth-loginRequired', function(e, response) {
    var pathExceptions = ['/', '/signin', '/signup', '/setup'];
    var requestExceptions = ['/api/users/myself/password'];
    if (!$rootScope.loginDialogPresented && !_(pathExceptions).contains($location.path()) && !_(requestExceptions).contains(response.config.url)) {
      $rootScope.loginDialogPresented = true;
      var modalInstance = $uibModal.open({
        template: require('./signin/signin-modal.html'),
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          Api.get(function(api) {
            function localStrategyFilter(strategy, name) {
              return name === 'local';
            }

            $scope.thirdPartyStrategies = _.map(_.omit(api.authenticationStrategies, localStrategyFilter), function(strategy, name) {
              strategy.name = name;
              return strategy;
            });

            $scope.localAuthenticationStrategy = api.authenticationStrategies.local;
          });

          var oldUsername = UserService.myself && UserService.myself.username || undefined;

          $scope.googleSignin = function() {
            UserService.oauthSignin('google', {uid: this.uid}).then(function(data) {
              if (data.username !== oldUsername) {
                data.newUser = true;
              }

              $rootScope.loginDialogPresented = false;
              $uibModalInstance.close($scope);
            }, function(data) {
              $scope.showStatus = true;

              if (data.device && !data.device.registered) {
                $scope.statusTitle = 'Device Pending Registration';
                $scope.statusMessage = data.errorMessage;
                $scope.statusLevel = 'alert-warning';
              } else {
                $scope.statusTitle = 'Error signing in';
                $scope.statusMessage = data.errorMessage;
                $scope.statusLevel = 'alert-danger';
              }
            });
          };

          $scope.login = function (data) {
            UserService.login(data).success(function() {
              if (data.username !== oldUsername) {
                data.newUser = true;
              }
              $rootScope.loginDialogPresented = false;
              $uibModalInstance.close($scope);
            }).error(function (data, status) {
              $scope.status = status;
            });
          };

          $scope.cancel = function () {
            $rootScope.loginDialogPresented = false;
            $uibModalInstance.dismiss('cancel');
          };
        }]
      });

      modalInstance.result.then(function () {
      });
    }

  });

  $rootScope.$on('event:auth-login', function(event, data) {
    function confirmLogin() {
      authService.loginConfirmed(data);

      if ($location.path() === '/signin' || $location.path() === '/setup') {
        $location.path('/map');
      }
    }

    Api.get(function(api) {
      var disclaimer = api.disclaimer || {};
      if (!disclaimer.show) {
        confirmLogin();
        return;
      }

      var modalInstance = $uibModal.open({
        template: require('./disclaimer/disclaimer.html'),
        controller: 'DisclaimerController',
        resolve: {
          disclaimer: function() {
            return api.disclaimer;
          }
        }
      });

      modalInstance.result.then(function () {
        confirmLogin();
      }, function() {
        UserService.logout();
      });
    });
  });
}
