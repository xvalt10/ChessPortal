angular.module('reservationModule',['constants']).factory('ReservationService',['$http', '$q','baseUrl', function( $http, $q,baseUrl){
	
		return {
		loadSlots: function(username, password){
			var defer=$q.defer();
			$http({
				method:'GET',
				url:baseUrl+'Reservation'

			}).then(onSuccess,onError);

			function onSuccess(response){
				defer.resolve(response)};
			function onError(response){ defer.reject(response)};
			return defer.promise;


		},
		uniqueDates: function(){
			var defer=$q.defer();
			$http({
				method:'GET',
				url:baseUrl+'Reservation/uniqueDates',

			}).then(onSuccess,onError);

			function onSuccess(response){
				defer.resolve(response)};
			function onError(response){ defer.reject(response)};
			return defer.promise;


		},
		reserveSlot : function(slotId, userId){
		console.log("Reserving slot:"+slotId+" for user:"+userId);
			var defer=$q.defer();
			$http({
				method:'PUT',
				url:baseUrl+'Reservation/'+slotId+'/'+userId,

			}).then(onSuccess,onError);

			function onSuccess(response){
				
			  defer.resolve(response);	
		

			};
			function onError(response){ defer.reject(response)};
			return defer.promise;
		},
		depositFunds : function(user, amount){
			var defer=$q.defer();
			$http({
				method:'PUT',
				url:baseUrl+'/users/'+user.userId+'/deposit/'+amount,

			}).then(onSuccess,onError);

			function onSuccess(response){
				
			  defer.resolve(response);	
		

			};
			function onError(response){ defer.reject(response)};
			return defer.promise;
		}
	}
}]);