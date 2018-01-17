module.exports = function fieldDirective() {
  var directive = {
    template: '<div ng-include src="templatePath"></div>',
    restrict: 'E',
    scope: {
      field: '=',
      observation: '=fieldObservation',
      form: '=fieldForm'
    },
    controller: FieldDirectiveController
  };

  return directive;
};

FieldDirectiveController.$inject = ['$scope', 'GeometryService'];

function FieldDirectiveController($scope, GeometryService) {
  var types = {
    textfield: 'app/observation/form/textfield.directive.html',
    numberfield: 'app/observation/form/numberfield.directive.html',
    email: 'app/observation/form/email.directive.html',
    textarea: 'app/observation/form/textarea.directive.html',
    checkbox: 'app/observation/form/checkbox.directive.html',
    date: 'app/observation/form/date.directive.html',
    geometry: 'app/observation/form/geometry.directive.html',
    dropdown: 'app/observation/form/dropdown.directive.html',
    multiselectdropdown: 'app/observation/form/multiselectdropdown.directive.html',
    hidden: 'app/observation/form/hidden.directive.html',
    password: 'app/observation/form/password.directive.html',
    radio: 'app/observation/form/radio.directive.html'
  };

  $scope.shapes = [{
    display: 'Point',
    value: 'Point'
  },{
    display: 'Line',
    value: 'LineString'
  },{
    display: 'Polygon',
    value: 'Polygon'
  }];

  if ($scope.field.type === 'geometry' && $scope.field.value) {
    $scope.shape = {
      type: $scope.field.value.type
    };
  }

  $scope.validateShapeChange = function() {
    if (!$scope.shape || !$scope.shape.type || $scope.shape.type === $scope.field.value.type) return;

    switch($scope.shape.type) {
    case 'Point':
      $scope.field.value.coordinates = [];
      $scope.field.value.type = 'Point';
      break;
    case 'LineString':
      $scope.field.value.coordinates = [];
      $scope.field.value.type = 'LineString';
      break;
    case 'Polygon':
      $scope.field.value.coordinates = [[]];
      $scope.field.value.type = 'Polygon';
      break;
    }

    $scope.field.value.type = $scope.shape.type;

    $scope.$emit('observation:shapechanged', $scope.observation, $scope.shape.type);
  };

  $scope.$watch('shape.type', $scope.validateShapeChange);

  $scope.datePopup = {open: false};
  $scope.templatePath = types[$scope.field.type];

  $scope.$watch('selected.value', function(value) {
    if (!value) return;

    $scope.field.value = [value];
  });

  $scope.onLatLngChange = function(field) {

    if (field.name === 'geometry') {
      var coordinates = angular.copy(field.value.coordinates);

      // copy edit field lat/lng in coordinates at correct index
      if (field.value.type === 'LineString') {
        coordinates[field.editedVertex] = angular.copy(field.edit);
      } else if (field.value.type === 'Polygon') {
        if (coordinates[0]) {
          coordinates[0][field.editedVertex] = angular.copy(field.edit);
        }
      }

      // Ensure first and last points are the same for polygon
      if (field.value.type === 'Polygon') {
        if (field.editedVertex === 0) {
          coordinates[0][coordinates[0].length - 1] = coordinates[0][0];
        } else if (field.editedVertex === coordinates[0].length - 1) {
          coordinates[0][0] = coordinates[0][coordinates[0].length - 1];
        }
      }

      // Check for polygon for intersections
      if (GeometryService.featureHasIntersections({geometry: {coordinates:coordinates}})) {
        if (field.value.type === 'LineString') {
          field.edit = angular.copy(field.value.coordinates[field.editedVertex]);
        } else if (field.value.type === 'Polygon') {
          if (field.value.coordinates[0]) {
            field.edit = angular.copy(field.value.coordinates[0][field.editedVertex]);
          }
        }

        return;
      }

      field.value.coordinates = coordinates;

      $scope.$emit('observation:moved', $scope.observation, field.value);
    }
  };

  $scope.openDate = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.datePopup.open = true;
  };

  $scope.today = function() {
    $scope.field.value = new Date();
  };

  $scope.clear = function () {
    $scope.field.value = null;
  };
}
