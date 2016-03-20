'use strict';

angular.module('myApp.Admin', ['ngRoute','loginModule','reservationModule','reservationFilters'])



.controller('AdminCtrl', ['$scope', 'LoginService','ReservationService','$location',function($scope,LoginService,ReservationService, $location) {

	$scope.makeDeposit=function(user,amount){
		console.log(user);
		ReservationService.depositFunds(user, amount).then(function(response){
			$scope.amount=null;
			console.log(response);
			$scope.message="The amount of "+amount+ " Euros has been successfully deposited to the account of the user "
			+user.username+". The user's new acount balance is:"+response.data.accountbalance+" Euros.";
			$scope.selectedUser=response.data;
		});

		
	};
	var init = function(){
		LoginService.getAllUsersFromDB().then(function(response){
			$scope.users=response.data;
			console.log(response.data); 
		}
			);
	};

	init();

}]);