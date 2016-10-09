angular.module('starter.controllers', [])
  .controller('LoginCtrl', function ($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.login = function () {
      // contact our login service with the data from the username and password fields
      LoginService.loginUser($scope.data.username, $scope.data.password).then(function (data) {
        // if it is a success, go to the Report screen
        $state.go('report');
      }, function (data) {
        // if there is an error pop it up onscreen
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
      // show a saving... message while we contact the service
      $ionicLoading.show({
        template: 'Saving...'
      });
      // pass through the values from the score and report fields to the service
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
