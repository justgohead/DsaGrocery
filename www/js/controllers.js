angular.module('starter.controllers', ['ionic', 'ngCordova'])
  .factory('Projects', function () {
    return {
      all: function () {
        var projectString = window.localStorage['projects'];
        if (projectString) {
          return angular.fromJson(projectString);
        }
        return [];
      },
      save: function (projects) {
        window.localStorage['projects'] = angular.toJson(projects);
      },
      newProject: function (projectTitle) {
        // Add a new project
        return {
          title: projectTitle,
          tasks: []
        };
      },
      getLastActiveIndex: function () {
        return parseInt(window.localStorage['lastActiveProject']) || 0;
      },
      setLastActiveIndex: function (index) {
        window.localStorage['lastActiveProject'] = index;
      }
    };
  })
  .controller('newsCtrl', ['$scope', '$rootScope', '$window', '$http', '$ionicLoading', '$ionicPopup', function ($scope, $rootScope, $window, $http, $ionicLoading, $ionicPopup) {
    var page = 1;
    $scope.hasnomore = true;
    $rootScope.s = [];
    $scope.getdata = function () {
      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
      });
      $http.get("http://localhost:8100/api/query?pno=" + page + "&ps=20&key=&dtype=json")
        .success(function (data, status, headers, config) {
          $ionicLoading.hide();
          if (data.result == null) {
            $ionicPopup.alert({
              title: '提示',
              template: '获取数据失败'
            });
          }
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
  }])
  .controller('todoCtrl', ['$scope', '$rootScope', '$window', '$http', '$ionicLoading', '$ionicPopup', '$ionicModal', 'Projects', function ($scope, $rootScope, $window, $http, $ionicLoading, $ionicPopup, $ionicModal, Projects) {
    var createProject = function (projectTitle) {
      var newProject = Projects.newProject(projectTitle);
      $scope.projects.push(newProject);
      Projects.save($scope.projects);
      $scope.selectProject(newProject, $scope.projects.length - 1);
    };
    $scope.projects = Projects.all();
    if ($scope.projects.length == 0) {
      createProject("projectName");
    }
    $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];
    $scope.popup = {
      isPopup: false,
      index: 0
    };
    // Called to create a new project
    $scope.newProject = function () {
      var projectTitle = prompt('名称');
      if (projectTitle) {
        createProject(projectTitle);
      }
    };

    // Create our modal
    $ionicModal.fromTemplateUrl('new-task.html', function (modal) {
      $scope.taskModal = modal;
    }, {
        scope: $scope
      });

    $scope.createTask = function (task) {
      if (!$scope.activeProject || !task) {
        return;
      }
      $scope.activeProject.tasks.push({
        title: task.title
      });
      $scope.taskModal.hide();

      // Inefficient, but save all the projects
      Projects.save($scope.projects);

      task.title = "";
    };

    $scope.newTask = function () {
      $scope.taskModal.show();
    };

    $scope.closeNewTask = function () {
      $scope.taskModal.hide();
    };

    $scope.popupMessageOpthins = function (index) {
      $scope.popup.index = index;
      $scope.popup.optionsPopup = $ionicPopup.show({
        templateUrl: "templates/todo/popup.html",
        scope: $scope,
      });
      $scope.popup.isPopup = true;
    };

    $scope.deleteTask = function () {
      var index = $scope.popup.index;
      $scope.activeProject.tasks.splice(index);
      Projects.save($scope.projects);
      $scope.popup.optionsPopup.close();
      $scope.popup.isPopup = false;
    };
  }]);
