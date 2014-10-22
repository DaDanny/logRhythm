'use strict';

angular.module('logRhythmApp')
  .controller('MainCtrl', function ($scope, StudentService,allStudents) {
    
    $scope.allStudents = allStudents;

     $scope.buildGraph = function(){
      var labelArray = [];
      var seriesArray = [];
      for(var student in $scope.allStudents){
        labelArray.push($scope.allStudents[student].name);
        seriesArray.push($scope.allStudents[student].grade);
      }
      var data = {
        labels: labelArray,
        series:[
          seriesArray
        ]
      };

      var options = {
        axisX : {
          offset : 5,
          showLabel : true,
          showGrid : true
        },
        axisY : {
          offset : 5,
          showLable : true,
          labelAlign : 'left'
        },
        scaleMinSpace: 5,
        showLine : true,
        lineSmooth : true,
        seriesBarDistance : 0
      }

      new Chartist.Bar('.ct-chart', data, options);
    };

    $scope.buildGraph();

    $scope.addStudent = function(){
      // Displays New Student Editor
      $scope.newStudentEditor = true;

      // Sets focus for focus on directive
      $scope.newStudentName=true

      $scope.badGrade = true;
      $scope.submittedGrade = false;
    }

    $scope.checkName = function(name){
      $scope.submittedName = true;
      if(typeof name != "string"){
        $scope.badName = true;
      }
      else{
        $scope.badName = false;
      }

      //$scope.checkValues()
    }

    $scope.checkGrade = function(grade){
      $scope.submittedGrade = true;
      if(grade > 100 || grade < 0) {
        console.log('here');
        $scope.badGrade = true;
      }
      else if(grade == '' || grade == undefined){
        $scope.badGrade = true;
      }
      else{
        $scope.badGrade = false;
      }
      //$scope.checkValues();
    }

    $scope.checkValues = function(){
      if($scope.submittedGrade == false){
        $scope.submittedGrade = true;
      }
      if(!$scope.badName && !$scope.badGrade){
        StudentService.addStudent($scope.newStudent)
          .then(function(response){
            var newStudent = response.studentObj();
            $scope.newStudentEditor = false;
            $scope.newStudent = {};
            $scope.allStudents.unshift(newStudent);
            $scope.buildGraph();

            console.log('add response:',response.studentObj() )
          })
      }
    }

    $scope.cancelAdd = function(){
      $scope.newStudent = {};
      $scope.submittedName = false;
      $scope.newStudentEditor= false;
      $scope.badName = false;
      $scope.submittedGrade = false;
    }

    $scope.deleteStudent = function(student){
      StudentService.deleteStudent(student)
        .then(function(response){
          var index = $scope.allStudents.indexOf(student);
          $scope.allStudents.splice(index,1);
          $scope.buildGraph();
        })
    }

   

  });
