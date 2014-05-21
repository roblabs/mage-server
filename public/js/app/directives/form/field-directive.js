'use strict';

angular.module('mage').directive('fieldDirective', function ($http, $compile) {

        var getTemplateUrl = function(field) {
            var type = field.type;
            var templateUrl = '';

            switch(type) {
                case 'textfield':
                    templateUrl = 'js/app/partials/form/field/textfield.html';
                    break;
                case 'email':
                    templateUrl = 'js/app/partials/form/field/email.html';
                    break;
                case 'textarea':
                    templateUrl = 'js/app/partials/form/field/textarea.html';
                    break;
                case 'checkbox':
                    templateUrl = 'js/app/partials/form/field/checkbox.html';
                    break;
                case 'date':
                    templateUrl = 'js/app/partials/form/field/date.html';
                    break;
                case 'geometry':
                      templateUrl = 'js/app/partials/form/field/geometry.html';
                      break;
                case 'dropdown':
                    templateUrl = 'js/app/partials/form/field/dropdown.html';
                    break;
                case 'hidden':
                    templateUrl = 'js/app/partials/form/field/hidden.html';
                    break;
                case 'p***REMOVED***word':
                    templateUrl = 'js/app/partials/form/field/p***REMOVED***word.html';
                    break;
                case 'radio':
                    templateUrl = 'js/app/partials/form/field/radio.html';
                    break;
            }
            return templateUrl;
        }

        return {
            template: '<div></div>',
            restrict: 'E',
            scope: {
                field:'='
            },
            link: function(scope, element) {
                // GET template content from path
                var templateUrl = getTemplateUrl(scope.field);
                $http.get(templateUrl).success(function(data) {
                    element.html(data);
                    $compile(element.contents())(scope);
                });
            }
        };
  });
