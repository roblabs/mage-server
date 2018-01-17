var angular = require('angular');

angular.module('mage')
  .directive('attachment', require('./observation-attachment.directive'))
  .directive('mapClip', require('./observation-map-clip.directive'))
  .directive('observationNewsItem', require('./observation-feed.directive'))
  .directive('observationPopup', require('./observation-popup.directive'))
  .directive('fieldDirective', require('./form/field.directive'))
  .directive('formDirective', require('./form/form.directive'));
