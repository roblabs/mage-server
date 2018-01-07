var angular = require('angular');

angular.module('mage')
  .controller('AdminSettingsController', require('./settings.controller'))
  .factory('Settings', require('./settings.resource'));
