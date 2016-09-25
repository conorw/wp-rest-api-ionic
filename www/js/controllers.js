angular.module('starter.controllers', [])
  .controller('LoginCtrl', function ($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.login = function () {
      LoginService.loginUser($scope.data.username, $scope.data.password).then(function (data) {
        $state.go('report');
      }, function (data) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      });
    }
  })
  .controller('ReportCtrl', function ($scope, $ionicLoading, $ionicPopup, WordpressService) {
    $scope.data = {};
    $scope.report = "";
    $scope.createReport = function () {
      $ionicLoading.show({
        template: 'Saving...'
      });
      WordpressService.createReport($scope.data.score, $scope.data.report).then(success, failure);
    }

    var success = function () {
      $ionicLoading.hide();
      $scope.data = {};
      var alertPopup = $ionicPopup.alert({
        title: 'Saved!',
        template: 'Your report has been created'
      });
    }

    var failure = function (err) {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: err.message
      });
    }

  });
