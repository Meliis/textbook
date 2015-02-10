'use strict';

angular.module('textbookApp')
  .controller('NewClassCtrl', function ($scope, $state, Auth, Classroom, User, $http) {
    $scope.user = Auth.getCurrentUser();
    $scope.file = {};
    $scope.addClassroom = function() {
      Classroom.save($scope.classroom, function(classroom) {
        $scope.user.classrooms.push(classroom);
        Auth.updateUser($scope.user);
        User.getUnpopulated({id: $scope.user._id}, function(user) {
          user.classrooms.push(classroom._id);
          User.update(user);
        });
        $state.go('classrooms.edit', {classId: classroom._id});
      });
    };
    $scope.uploadFile = function() {
     
          var reader = new FileReader();
          var name = $scope.file.name;
          var json = [];
          var csv;
          reader.onload = function(e) {
            var data = e.target.result;
            if(name.indexOf('.xlsx') > -1) {
              console.log('this is a xlsx');
              var workbook = XLSX.read(data, {type:'binary'});
              json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
              console.log(json);
            } else if(name.indexOf('.xls') > -1) {
              console.log('this is xls');
              var workbook = XLS.read(data, {type:'binary'});
              json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
              console.log(json);
            } else if (name.indexOf('.csv') > -1) {
              console.log('this is a csv');
              csv = data;
              var result = Papa.parse(csv);
              var columns = result.data.shift()
              result.data.forEach(function(student) {
                var studentObj = {};
                student.forEach(function(val, i) {
                  studentObj[columns[i]] = val;
                });
                json.push(studentObj);
              });
            } else {
              alert('you need to upload the correct file');
            }
            $scope.studentRoster = json;
            $state.go('.studentRoster');
      };
      reader.readAsBinaryString($scope.file);

    };
  });
