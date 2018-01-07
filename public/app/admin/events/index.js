var angular = require('angular');

angular.module('mage')
  .controller('AdminEventController', require('./event.controller'))
  .controller('AdminEventEditController', require('./event.edit.controller'))
  .controller('AdminEventEditFormController', require('./event.edit.form.controller'))
  .controller('AdminEventsController', require('./events.controller'))
  .controller('AdminEventAccessController', require('./event.access.controller'))
  .filter('events', require('./events.filter'));
