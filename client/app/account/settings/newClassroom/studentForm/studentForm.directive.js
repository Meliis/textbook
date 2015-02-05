'use strict';

angular.module('textbookApp')
  .directive('studentForm', function () {
    return {
      templateUrl: 'app/account/settings/newClassroom/studentForm/studentForm.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  })
  .controller('studentFormController', function($scope, Student, Contact) {
  	$scope.currentStudent = {
      firstName: "",
      lastName: "",
      primaryPhone: "",
      contacts: []
    };

    $scope.currentContact = {
      name: "",
      relationship: "",
      phone: ""
    };

    $scope.addContact = function() {
      $scope.currentStudent.primaryPhone = $scope.currentContact.phone;
      Contact.save($scope.currentContact, function(contact) {
          $scope.currentStudent.contacts.push(contact);
      });
      $scope.currentContact = {
        name: "",
        relationship: "",
        phone: ""
      };
    };

    $scope.addStudent = function() {
      if ($scope.currentStudent.firstName.length && $scope.currentStudent.lastName.length && $scope.currentStudent.contacts.length) {
         $scope.classroom.students.push($scope.currentStudent);
         var studentToSave = _.clone($scope.currentStudent);
         studentToSave.contacts = studentToSave.contacts.map(function(contact) {return contact._id});
         Student.save(studentToSave, function(student) {
          $scope.classroom.students[$scope.classroom.students.length - 1]._id = student._id;
          console.log($scope.classroom);
          $scope.currentStudent = {
            firstName: "",
            lastName: "",
            primaryPhone: "",
            contacts: []
           };
         });

      }
    };

    $scope.deleteContact = function(contactId) {
        $scope.currentStudent.contacts.forEach(function(contact, i) {
          if(contact._id === contactId) {
            Contact.delete({id: contact._id});
            $scope.currentStudent.contacts.splice(i, 1);
          } 
        })
      };
      
      $scope.$on('close editview', function(event, data) {
        $scope.editView = '';
      });

    $scope.editView;
    $scope.showEdit = function(contactId) {
      if($scope.editView === contactId) {
        $scope.editView = '';
      } else {
        $scope.editView = contactId;  
      }
    };


  })




