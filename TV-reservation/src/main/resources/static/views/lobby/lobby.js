/**
 * 
 */
'use strict';

angular
		.module(
				'myApp.LobbyModule',
				[ 'ngRoute', 'ui.bootstrap', 'reservationFilters', 'constants', 'ngScrollbars' ])

		.controller(
				'LobbyCtrl',
				[
						
						'LoginService',
						'WebSocketService',
						'$scope', '$rootScope','$interval', '$location',
						
						
						function( LoginService,WebSocketService, $scope, $rootScope, $interval, $location) {
							
							$scope.chatMessage={action:"chatMessageLobby"};
							$scope.time = 0;
							$scope.increment = 0;
							$scope.messages=[];
							$scope.countOfPlayersOnline = 0;
							$scope.gamesInProgress = 0;
							$scope.playersOnline = [];
							$scope.seekingOponent = false;
							$scope.seekFormShown = false;


							var socket={};
							var queryPlayersInterval;
							var seekOponentInterval;
							
							$scope.sendChatMessage = function(){
								$scope.chatMessage.author=$rootScope.user;
								socket.send(JSON.stringify($scope.chatMessage));
								$scope.chatMessage.message = "";
							}
							
							$scope.config = {

								autoHideScrollbar: false,
								setHeight: 300,
								scrollInertia: 500,
								axis: 'yx',
								advanced: {
									updateOnContentResize: true
								},
								scrollButtons: {
									scrollAmount: 'auto', // scroll amount when button pressed
									enable: true // enable scrolling buttons by default
								},
								theme: 'dark'
								    };
							
							$scope.displayChatMessage = function(message){
								var size=$scope.messages.length;
								message.date=new Date();
								$scope.messages.unshift(message);
								$scope.$apply();
								
								
							}

							$scope.seekOponent = function (time, increment) {
								var seekDetails = {

									action: "seekOponent",
									user: LoginService.getUserLoggedIn().username,
									time: parseInt(typeof time !== 'undefined' ? time
										: $scope.time),
									increment: parseInt(typeof increment !== 'undefined' ? increment
										: $scope.increment)

								}
								seekOponentInterval=$interval(function(){
									socket.send(JSON.stringify(seekDetails));
								},1000);

								$scope.seekingOponent = true;
								$scope.seekFormShown = false;
							};

							$scope.showSeekForm = function () {
								$scope.seekFormShown = true;
							};
							
							function queryPlayersOnline() {
								console.log("Querying players online.");
								socket.send(JSON.stringify({user:$rootScope.user,action:"getPlayersOnline"}));

							}

							$scope.observeGame = function(playername){
								$location.path("/playingHall/observe/"+playername);
							}
							
							function onMessage(event) {
								//console.log(event);
								var data = JSON.parse(event.data);
								if (data.action == "chatMessageLobby") {
									$scope.displayChatMessage(data);
								}
								if (data.action == "getPlayersOnline") {
									console.log(data.players);
									$scope.playersOnline = data.players;
									$scope.countOfPlayersOnline = data.players.length;
									$scope.gamesInProgress = data.gamesInProgress;
								}
								if (data.action === "startGame") {
										console.log(data);
									    $interval.cancel(seekOponentInterval);
									    $interval.cancel(queryPlayersInterval)
									    $location.path("/playingHall/"+data.gameId);
										console.log("Game started.")
								}
								if (data.action === "gameInfo") {
									console.log("Received game info:"+data);
								}
							}
							var init = function(){

								socket=WebSocketService.initWebSockets();
								socket.onmessage=onMessage;
								socket.onclose=function(event){
									console.log("closing timer");
									$interval.cancel(queryPlayersInterval);
									$interval.cancel(seekOponentInterval);
								};
								
								queryPlayersInterval=$interval(queryPlayersOnline,1000);
						
								}
							
							init();
						}]);