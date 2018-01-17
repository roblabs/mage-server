module.exports = function iconUser() {
  var directive = {
    restrict: "A",
    templateUrl: '/app/user/user-icon.directive.html',
    scope: {
      user: '=iconUser'
    },
    controller: IconUserController
  };

  return directive;
};

IconUserController.$inject = ['$scope', '$element', 'LocalStorageService'];

function IconUserController($scope, $element, LocalStorageService) {
  $scope.iconUrl = getIconUrl($scope.user);

  $scope.$watch('user.iconUrl', function(iconUrl) {
    $scope.iconUrl = getIconUrl(iconUrl);
  }, true);

  function getIconUrl(iconUrl) {
    var token = LocalStorageService.getToken();

    if (iconUrl) {
      return iconUrl + "?access_token=" + token + '&_dc' + $scope.user.lastUpdated;
    } else {
      return "img/missing_marker.png";
    }
  }
}
