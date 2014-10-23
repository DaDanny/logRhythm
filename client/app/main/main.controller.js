'use strict';

angular.module('logRhythmApp')
  .controller('MainCtrl', function ($scope, StudentService,allStudents) {
    
    $scope.allStudents = allStudents;

    $scope.buildGraph = function(){
      var labelArray = [];
      var seriesArray = [];
      $scope.minGrade = $scope.allStudents[0].grade;
      $scope.maxGrade = $scope.allStudents[0].grade;
      $scope.average = 0;
      var total = 0;
      for(var student in $scope.allStudents){
        labelArray.push($scope.allStudents[student].name);
        seriesArray.push($scope.allStudents[student].grade);
        total += $scope.allStudents[student].grade;
        if($scope.minGrade > $scope.allStudents[student].grade){
          $scope.minGrade = $scope.allStudents[student].grade;
        }
        if($scope.maxGrade < $scope.allStudents[student].grade){
          $scope.maxGrade = $scope.allStudents[student].grade;
        }
      }

      $scope.average = (total / $scope.allStudents.length)
      var data = {
        labels: labelArray,
        series:[
          seriesArray
        ]
      };

      var options = {
        axisX : {
          offset : 8,
          showLabel : true,
          showGrid : true
        },
        axisY : {
          offset : 8,
          showLable : true,
          labelAlign : 'left'
        },
        scaleMinSpace: 5,
        showLine : true,
        high : 100,
        lineSmooth : true,
        seriesBarDistance : 0
      }

      new Chartist.Bar('.ct-chart', data, options);
    };

    $scope.buildGraph();

    $scope.addStudent = function(){
      // Displays New Student Editor
      $scope.newStudentEditor = true;
      $scope.edited = '';
      $scope.studentToEdit = '';

      // Sets focus for focus on directive
      $scope.focusNewName=true

      //$scope.badGrade = true;
      $scope.submittedGrade = false;
      $scope.submittedName = false;
    }

    $scope.checkName = function(student,type){
      console.log('name', student)
      $scope.submittedName = true;
      if(student != undefined){
        if(typeof student.name != "string"){
          $scope.badName = true;
        }
        else{
          $scope.badName = false;
        }
        $scope.focusNewGrade = true;
      }  
      else{
        $scope.badName = true;
      }
    }

    $scope.checkGrade = function(student,type){
      $scope.submittedGrade = true;
      if(student != undefined){
        if(isNaN(student.grade)){
          $scope.badGrade = true;
        }
        else if(student.grade > 100 || student.grade < 0) {
          $scope.badGrade = true;
        }
        else if(student.grade == '' || student.grade == undefined){
          $scope.badGrade = true;
        }
        else{
          $scope.badGrade = false;
        }
        console.log('gradechck:', student)
      }
      else{
        $scope.badGrade = true;
      }
    }

    $scope.checkValues = function(student, type){
      console.log('student: ', student);
        if(!$scope.submittedName){
          $scope.checkName(student, type); 
        }
        if(!$scope.submittedGrade && $scope.submittedName){
          $scope.checkGrade(student,type);
        }
        if(!$scope.badGrade && !$scope.badName && type=='new'){
          console.log('save!');
          StudentService.addStudent($scope.newStudent)
            .then(function(response){
              var newStudent = response.studentObj();
              $scope.newStudentEditor = false;
              $scope.newStudent = {};
              $scope.allStudents.unshift(newStudent);
              $scope.buildGraph();
            })
        }
        else if(!$scope.badGrade && !$scope.badName && type=='edit'){
          console.log('edit');
          var editedStudent = {
            name : student.name,
            grade : student.grade,
            _id : $scope.studentToEdit
          }
          StudentService.editStudent(editedStudent)
            .then(function(response){
              var update = response.studentObj();
              var index = $scope.allStudents.indexOf($scope.oldStudent);
              console.log('index: ' ,index);
              $scope.allStudents[index] = update;
              console.log(response.studentObj());
              $scope.studentToEdit = '';
              $scope.buildGraph();
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

    $scope.cancelEdit = function(){
      $scope.studentToEdit = '';
    }

    $scope.deleteStudent = function(student){
      StudentService.deleteStudent(student)
        .then(function(response){
          var index = $scope.allStudents.indexOf(student);
          $scope.allStudents.splice(index,1);
          $scope.buildGraph();
        })
    }

    $scope.editStudent = function(student){
      $scope.oldStudent = student;
      $scope.submittedGrade = false;
      $scope.submittedName = false;
      $scope.newStudentEditor = false;

      $scope.studentToEdit = student._id;
      $scope.edited = {
        name : student.name,
        grade : student.grade
      };

      $scope.editStudentName = true;
      $scope.focusNewName = false;
    }

  });
