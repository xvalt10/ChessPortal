'use strict';

// Declare app level module which depends on views, and components
angular
		.module(
				'myApp',
				[ 'ngRoute', 'myApp.Login', 'myApp.reservation', 'myApp.Admin',
						'myApp.version', 'loginModule', 'reservationModule',
						'registerModule', 'reservationFilters', 'constants','dragModule','myApp.BoardModule' ])
		
		.config(['$routeProvider','$httpProvider', function($routeProvider, $httpProvider) {

			$routeProvider.when('/admin', {
				templateUrl : 'views/admin/admin.html',
				controller : 'AdminCtrl'
			});
			$routeProvider.when('/loginpage', {
				templateUrl : 'views/login/login.html',
				controller : 'LoginCtrl'
			});
			$routeProvider.when('/register', {
				templateUrl : 'views/registration/registerUser.html',
				controller : 'RegisterCtrl'
			});

			$routeProvider.when('/reservation', {
				templateUrl : 'views/reservation/reservation.html',
				controller : 'ReservationCtrl'
			});
			$routeProvider.when('/playingHall', {
				templateUrl : 'views/playingHall/playingHall.html',
				controller : 'BoardCtrl'
			});
			$routeProvider.when('/lobby', {
				templateUrl : 'views/lobby/lobby.html',
				controller : 'BoardCtrl'
			});
			
			$routeProvider.otherwise({
				redirectTo : '/index.html'
			});
			$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
		} ]);
	

angular.module('loginModule', []);
angular.module('reservationModule', []);
angular.module('registerModule', []);
