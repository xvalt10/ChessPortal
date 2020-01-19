'use strict';

angular.module('myApp.Login', ['ngRoute','loginModule'])

.controller('LoginCtrl', ['$rootScope', '$scope', 'LoginService','$location', '$http',function($rootScope,$scope,LoginService, $location, $http) {
var authenticationData={};
//	$scope.login =function(){,
//		console.log("Authenticating user");
//		LoginService.validateUser($scope.username, $scope.password).then(
//			function(response){
//				$scope.authenticationResult=response.data.length;
//				if ($scope.authenticationResult==1){
//					LoginService.setUserLoggedIn(response.data[0]);
//					console.log(response.data[0]);
//
//					$location.path("/reservation");
//				}
//				console.log($scope.authenticationResult);
//				console.log(LoginService.getUserLoggedIn());
//
//			}
//			);
//	}

	$scope.redirectTo=function(path){
		
		$location.path(path);
	};
	
	var authenticate = function(credentials, callback) {

	    var headers = credentials ? {authorization : "Basic "
	        + btoa(credentials.username + ":" + credentials.password)
	    } : {};

	    $http.get('user', {headers : headers}).success(function(data) {
	      if (data.name) {
	    	  authenticationData=data;

	    	  LoginService.getUserFromDB(data.name).then(function(response){
	    		  var user = response.data;
	    		  user.role = authenticationData.authorities[0].authority;
	    		  console.log("Setting user into session.");
	    		  LoginService.setUserLoggedIn(response.data);
	    		  $rootScope.$broadcast('userAddedToSession');
	    	  });

	        $rootScope.authenticated = true;
	        $rootScope.user = data.name;
	      } else {
	    	  console.log("User not authenticated.");
	        $rootScope.authenticated = false;
	      }
	      callback && callback();
	    }).error(function() {
	      $rootScope.authenticated = false;
	      callback && callback();
	    });

	  };
	authenticate();
	 $scope.credentials = {};
	  
	  
	  $scope.login = function() {
	      authenticate($scope.credentials, function() {
	        if ($rootScope.authenticated) {
	        	console.log("Changing location to reservation");
	        
	          $location.path("/lobby");
	          $scope.error = false;
	        } else {
	          $location.path("/loginpage");
	          $scope.error = true;
	        }
	      });
	  };
	  
	  $scope.logout = function() {
		  $http.post('logout', {}).success(function() {
			  console.log("Logging user out.");
			  LoginService.removeUserFromSession();
		    $rootScope.authenticated = false;
		    $location.path("/");
		  }).error(function(data) {
		    $rootScope.authenticated = false;
		  });
		}
	  ,
		
		$scope.userHasRole= function(role){
		  var user = LoginService.getUserLoggedIn();
		  if (user==null){
			  return false;
		  }

			if (user.role==role){
				return true;
			}
			else 
			return false;
		}
	
}]);

