var app = angular.module('app', []);

app.controller('MainCtrl', ['$scope', function MainController($scope) {
    $scope.title = 'Some text here';
    $scope.selectedTab = 'Home';
}]);