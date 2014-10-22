'use strict';

angular.module('logRhythmApp')
  .controller('MainCtrl', function ($scope, StudentService) {
    StudentService.getStudents()
      .then(function(response){
        console.log(response);
      })
    // StudentService.addStudent(student)
    //   .then(function(response){
    //     console.log(response.studentObj());
    //   })

  $scope.buildGraph = function(){
    console.log('here');
    var data = {
      labels: ['Danny', 'Mike', 'Steve', 'Brittney'],
      series:[
        [99, 65, 78, 30]
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
  }

  });
