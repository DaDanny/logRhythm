'use strict';

angular.module('logRhythmApp')
  .controller('MainCtrl', function ($scope, StudentService,allStudents) {
    
    /*
    Using ui-router's resolve feature, we pass in all the students
    into the controller to ensure our data is ready before the controller
    loads
    */
    $scope.allStudents = allStudents;

    /*
    Using the Chartist API, we can build an SVG bar chart.

    We also find the average, Max and Min in this function
    since we are already looping through the studentArray to
    construct the barGraph
    */
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

      // Options for the layout of graph
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

      // Initalize our check variables
      $scope.submittedGrade = false;
      $scope.submittedName = false;
    }

    /*
    Takes in student and type (new Student or editing existing)
    Checks to see if the student is undefined, then if the name
    is a string.
    If any check fails, it displays an error message and does 
    not go on to save

    Called from CheckValues and on the blur method of input
    */
    $scope.checkName = function(student,type){
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

    /*
    Takes in student and type. 
    First checks if our number is Not a Number
    then it checks the range of the numeber [0,100].
    Finally it chekcs to see if they are undefined or 
    empty strings

    Called from CheckValues and on the blur method of input
    */
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
      }
      else{
        $scope.badGrade = true;
      }
    }

    /*
    If we haven't checked the name, first check it

    If we do not have a bad name or grade
    Then we can save or update the scope

    Calls the student service to make the post or put
    request based on if we are updating or adding.

    badName and badGrade must both be false for this
    function to save/edit
    */
    $scope.checkValues = function(student, type){
        if(!$scope.submittedName){
          $scope.checkName(student, type); 
        }
        if(!$scope.submittedGrade && $scope.submittedName){
          $scope.checkGrade(student,type);
        }
        if(!$scope.badGrade && !$scope.badName && type=='new'){
          StudentService.addStudent($scope.newStudent)
            .then(function(response){
              var newStudent = response.studentObj();
              // Hide the div to add a new student
              $scope.newStudentEditor = false;
              $scope.newStudent = {};
              // Add the new student to the front of the list
              $scope.allStudents.unshift(newStudent);
              $scope.buildGraph();
            })
        }
        else if(!$scope.badGrade && !$scope.badName && type=='edit'){
          // Create new student obj to be passed to service
          var editedStudent = {
            name : student.name,
            grade : student.grade,
            _id : $scope.studentToEdit
          }
          StudentService.editStudent(editedStudent)
            .then(function(response){
              var update = response.studentObj();
              // Get the index of the old Student Obj so we can replace it
              var index = $scope.allStudents.indexOf($scope.oldStudent);
              $scope.allStudents[index] = update;
              $scope.studentToEdit = '';
              $scope.buildGraph();
            })
        }
    }

    /*
    Hide the editor and reset the values of the inputs
    and checks (submittedGrade and submittedName)
    */
    $scope.cancelAdd = function(){
      $scope.newStudent = {};
      $scope.submittedName = false;
      $scope.newStudentEditor= false;
      $scope.badName = false;
      $scope.submittedGrade = false;
    }

    /*
    Resets the studentToEdit variable
    So all list-items display as normal
    */
    $scope.cancelEdit = function(){
      $scope.studentToEdit = '';
    }

    /*
    Calls the service to delete the inputted student
    When the service returns, we also remove the student
    from the studentlist
    */
    $scope.deleteStudent = function(student){
      StudentService.deleteStudent(student)
        .then(function(response){
          var index = $scope.allStudents.indexOf(student);
          $scope.allStudents.splice(index,1);
          $scope.buildGraph();
        })
    }

    /*
    We display a different list-item if we want to edit
    a student. 
    When we edit a student, we now set them as the studentToEdit
    So the list-item changes to inputs to update their information.

    Similar to addStudent, we check the name and grade for
    correct input before we call checkValues to save to server
    */
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
