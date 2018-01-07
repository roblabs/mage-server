var angular = require('angular');

angular
  .module('mage')
  .controller('AdminController', require('./admin.controller'))
  .directive('adminTab', function() {
    return {
      restrict: "A",
      templateUrl: 'app/admin/admin.tab.html',
      replace: true,
      scope: {
        tab: '=adminTab'
      },
      controller: require('./admin.tab.directive')
    };
  });

require('./users');
require('./devices');
require('./events');
require('./layers');
require('./settings');
require('./teams');
