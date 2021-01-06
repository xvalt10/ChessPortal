'use strict';

angular.module('myApp.reservation', ['ngRoute','ui.bootstrap', 'reservationFilters', 'constants']) 




.controller('ReservationCtrl', ['ReservationService','LoginService','$scope','$rootScope','$modal','$q', '$http',function(ReservationService,LoginService, $scope,$rootScope,$modal, $q, $http) {

	var slot={};
	var user;
	
	$scope.openDialog=function(timeSlot, userId){
		slot = timeSlot;
		user=userId;
		var dialogWindow = $modal.open({
			templateUrl: 'views/reservation/confirmationWindow.html',
			controller: ConfirmationWindowController,
			scope:$scope.$new(true),
			resolve:{
				timeSlot:function(){return slot},
				user:function(){return user}
				
			}

		});
	};

	var ConfirmationWindowController = function($scope, $modalInstance, timeSlot,userId){

		$scope.timeSlot=timeSlot;
		$scope.userId=userId;

		$scope.close = function () {
			console.log("Closing dialog window;");
			$modalInstance.close();
		};

		$scope.makeReservation=function(){
			console.log(timeSlot);
			console.log("Slotid "+timeSlot.slotId+" userId " +timeSlot.userId);
			ReservationService.reserveSlot(timeSlot.slotId, userId).then(function(response){
				
				
				$modalInstance.close();
				$scope.$emit('updateTimeSlots');
			}, function(error){
				$scope.errorMessage=error.data.message;
			});
			
		};
	};

	ConfirmationWindowController['$inject'] = ['$scope','$modalInstance', 'timeSlot', 'user'];

	$rootScope.$on('userAddedToSession', function(){
		console.log("REacting to userAddedToSession Event");
		$scope.user=LoginService.getUserLoggedIn();
	});
	
	$scope.$on('updateTimeSlots', function(){
		var user=LoginService.getUserLoggedIn();
		
		LoginService.getUserFromDB(user.username).then(
			function(response){
				
				var userRole=user.role;
				response.data.role=userRole;
				LoginService.setUserLoggedIn(response.data);
				$scope.user=LoginService.getUserLoggedIn();
			}
			);
		ReservationService.loadSlots().then(
			function(response){
				console.log("Catch");
				console.log(response.data);
				$scope.timeslots=response.data;		

			});
	});

	var init = function (){
console.log("Getting user from session storage");
		

			ReservationService.loadSlots().then(
			function(response){
				$scope.timeslots=response.data;				
				console.log(response.data);
			});
			$scope.user=LoginService.getUserLoggedIn();
			console.log(LoginService.getUserLoggedIn());
	}

		ReservationService.uniqueDates().then(
			function(response){
				$scope.uniqueDates=response.data;
				$scope.selectedDate=response.data[0];
				console.log(response.data);		
				
			});
	
	
	init();
}]);