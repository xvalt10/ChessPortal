'use strict';

angular.module('registerModule', ['ngRoute','loginModule'])

.controller('RegisterCtrl', ['$rootScope','$scope', 'LoginService','$location',function($rootScope,$scope,LoginService, $location) {

	$scope.registerUser =function(){

		LoginService.registerUser($scope.username, $scope.password).then(
			function(response){
				console.log(response);
				
				if (response.status==200){
					$scope.successMessage="Registration of the user "+$scope.username+" was successful. You can proceed to login";
					console.log("Registration of user:"+$scope.username+" was successfull.");
					$scope.username=null;
					$scope.password=null;
					$scope.password2=null;
					$scope.registrationForm.$setPristine() ;
					//$location.path("/Login");
				}
				else {
					$scope.errorMessage="Registration of the user "+$scope.username+" was unsuccessful due to a technical error. Please try to register again later";
				}
				
			}
			);
	}

}]);