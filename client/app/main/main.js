'use strict';

angular.module('logRhythmApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
          StudentService : 'StudentService',
          allStudents : function(StudentService){
            return StudentService.getStudents()
              .then(function(response){
                return response;
              })
          }

        }
      });
  });