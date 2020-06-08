/* 'use strict';

// Declare app level module which depends on views, and components
angular
		.module(
				'myApp',
				[ 'ngRoute', 'myApp.Login', 'myApp.reservation', 'myApp.Admin',
						'myApp.version', 'loginModule','websocketModule','myApp.LobbyModule', 'reservationModule',
						'registerModule', 'reservationFilters', 'constants','dragModule','myApp.BoardModule','ngScrollbars'])
		
		.config(['$routeProvider','$httpProvider','ScrollBarsProvider', function($routeProvider, $httpProvider,ScrollBarsProvider) {

			ScrollBarsProvider.defaults = {
				autoHideScrollbar: false,

				scrollInertia: 500,
				axis: 'y',
				advanced: {
					updateOnContentResize: true
				},
				scrollButtons: {
					scrollAmount: 'auto', // scroll amount when button pressed
					enable: true // enable scrolling buttons by default
				},
				theme: 'dark'
			};


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
			$routeProvider.when('/playingHall/:gameId', {
				templateUrl : 'views/playingHall/playingHall.html',
				controller : 'BoardCtrl'
			});
			$routeProvider.when('/analyzeGame', {
				templateUrl : 'views/playingHall/playingHall.html',
				controller : 'BoardCtrl'
			});
			$routeProvider.when('/lobby', {
				templateUrl : 'views/lobby/lobby.html',
				controller : 'LobbyCtrl'
			});
			
			$routeProvider.otherwise({
				redirectTo : '/index.html'
			});
			$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
		} ]);
	

angular.module('loginModule', []);
angular.module('reservationModule', []);
angular.module('registerModule', []);
angular.module('websocketModule', []);

 */