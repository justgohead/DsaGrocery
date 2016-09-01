angular.module('starter.controllers', ['ionic', 'ngCordova'])
  .controller('searchCtrl', ['$scope', '$rootScope', '$window', '$http', '$ionicLoading', '$ionicPopup', function ($scope, $rootScope, $window, $http, $ionicLoading, $ionicPopup) {
    var page = 1;
    $scope.hasnomore = true;
    $rootScope.s = [];
    $scope.getdata = function () {
      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
      });
      $http.get("http://localhost:8100/api/query?pno=" + page + "&ps=20&key=2a9f296739ad5217d570a6296bc9b638&dtype=json")
        .success(function (data, status, headers, config) {
          $ionicLoading.hide();
          page++;
          $rootScope.s = $rootScope.s.concat(data.result.list);
          $scope.hasnomore = false;
          if (data.result.totalPage <= page) {
            $scope.hasnomore = true;
          }
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
        .error(function (data, status, headers, config) {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $ionicPopup.alert({
            title: '提示',
            template: '获取数据失败'
          });
        });
    };
    $scope.refreshdata = function () {
      page = 1;
      $scope.getdata();
    }
    $scope.showDetail = function (url) {
      $window.location = url;
    };
    $scope.getdata();
  }]);
