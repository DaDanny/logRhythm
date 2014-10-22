'use strict';

angular.module('logRhythmApp')
  .controller('MainCtrl', function ($scope, StudentService) {
    StudentService.getStudents()
      .then(function(response){
        console.log(response);
      })
    var student = {
      name : 'Danny Francken',
      grade : 70
    };
    StudentService.addStudent(student)
      .then(function(response){
        console.log(response.studentObj());
      })
  });
