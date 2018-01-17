require('jquery');

AvatarUserEditController.$inject = ['$scope', '$element'];

function AvatarUserEditController($scope, $element) {
  $scope.fileName = 'Choose an avatar image...';

  $element.find(':file').change(function() {
    $scope.file = this.files[0];
    $scope.fileName = $scope.file.name;
    $scope.$emit('userAvatar', $scope.file);
  });

  $scope.$watch('user.avatar', function(avatar) {
    if (!avatar) {
      $scope.file = null;
      $scope.fileName = 'Choose an avatar image...';
      $scope.$emit('userAvatar', null);
    }
  });
}

module.exports = function avatarUserEdit() {
  var directive = {
    restrict: "A",
    templateUrl: '/app/user/user-avatar-edit.directive.html',
    scope: {
      user: '=avatarUserEdit'
    },
    controller: AvatarUserEditController
  };

  return directive;
};
