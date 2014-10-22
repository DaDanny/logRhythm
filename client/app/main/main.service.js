'use strict';

angular.module('logRhythmApp')
  .service('StudentService', function($http, $q){
    return{
      /*
      Using $http, make a GET request to the backend DB
      to retrieve all students with their affilated scores

      Creates promise object which then returns the response
      once the promise is fulfilled
      If promise does not return data, we reject it with 
      $q
      */
      getStudents : function(){
        return $http.get('/api/students')
          .then(function(response){
            if(typeof response.data === 'object'){
              return response.data;
            }
            else{
              return $q.reject(response.data);
            }
          },function(response){
            return $q.reject(response.data);
          });
      },
      /*
      Using $http, make POST request with the studentObj 
      from the controller. 

      Using a promise object, we are able to return data from
      the server which is passed to controller to update the 
      scope.
      */
      addStudent : function(studentObj){
        /*
        Create promise object which returns
        the response from the server.
        Response should be the saved student object
        */
        var promise = $http({
          method : 'POST',
          url : '/api/students',
          data : studentObj,
          headers : {'Content-Type' : 'application/json'}
        }).then(function(response){
          studentObj = response.data;
          //Return response data
          return{
            studentObj : function(){
              return studentObj;
            }
          }
        });
        return promise;
      },
      /*
      Takes in the edited studentObj and sends it to
      the server which updates the DB document

      Returns the updated student document
      */
      editStudent : function(studentObj){
        var promise = $http({
          method : 'PUT',
          url : '/api/students/' + studentObj._id,
          data : studentObj,
          headers : {'Content-Type' : 'application/json'}
        }).then(function(response){
          studentObj = response.data;
          return{
            studentObj : function(){
              return studentObj;
            }
          }
        });
        return promise;
      },
      deleteStudent : function(studentObj){
        return $http.delete('/api/students/' + studentObj._id)
          .then(function(response){
            console.log(response)
            return response;
          })
      }
    }
  })