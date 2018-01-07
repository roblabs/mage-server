window.jQuery = window.$ = require('jquery');

var angular = require('angular');

require('jquery-minicolors');
require('angular-minicolors');

angular.module('mage', [
  require('angular-ui-bootstrap'),
  require('ui-select'),
  'minicolors',
  require('angular-animate'),
  require('angular-sanitize'),
  require('angular-route'),
  require('angular-resource'),
  require('angular-messages'),
  require('videogular'),
  require('videogular-controls'),
  require('videogular-overlay-play'),
  require('./app/auth/http-auth-interceptor')
]);

require ('./css');
require('./app');

// TODO put in zxcvbn
// TODO ask Dan about gapi
