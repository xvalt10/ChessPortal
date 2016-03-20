angular.module('loginModule').factory('LoginService',['$http', '$q','$window', function( $http, $q, $window){
var userLoggedIn;
var baseUrl='http://localhost:8082/';

	return {

		registerUser: function(username, password){
			var defer=$q.defer();
			$http({
				method:'POST',
				url:baseUrl +'register?username='+username+'&password='+password,

			}).then(onSuccess,onError);

			function onSuccess(response){
				defer.resolve(response)};
			function onError(response){ defer.reject(response)};
			return defer.promise;
		},
		validateUser: function(username, password){
			var defer=$q.defer();
			$http({
				method:'GET',
				url:baseUrl+'login/?username='+username+'&password='+password,

			}).then(onSuccess,onError);

			function onSuccess(response){
				defer.resolve(response)};
			function onError(response){ defer.reject(response)};
			return defer.promise;
		},
		getUserFromDB:function(username){
			var defer=$q.defer();
			$http({
				method:'GET',
				url:baseUrl+'users/'+username

			}).then(onSuccess,onError);

			function onSuccess(response){
				defer.resolve(response)};
			function onError(response){ defer.reject(response)};
			return defer.promise;

		},
		getAllUsersFromDB:function(){
			var defer=$q.defer();
			$http({
				method:'GET',
				url:baseUrl+'users'

			}).then(onSuccess,onError);

			function onSuccess(response){
				defer.resolve(response)};
			function onError(response){ defer.reject(response)};
			return defer.promise;

		},
		setUserLoggedIn: function (user){
			$window.sessionStorage.setItem("userLoggedIn",JSON.stringify(user));
		},
		getUserLoggedIn: function(){
			return JSON.parse($window.sessionStorage.getItem("userLoggedIn"));
		},
		removeUserFromSession: function(){
			console.log("Removing user from session storage");
			$window.sessionStorage.removeItem("userLoggedIn");
		}

	}
}]);