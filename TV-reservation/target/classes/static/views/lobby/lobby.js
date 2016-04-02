/**
 * 
 */
'use strict';

angular
		.module(
				'myApp.LobbyModule',
				[ 'ngRoute', 'ui.bootstrap', 'reservationFilters', 'constants' ])

		.controller(
				'LobbyCtrl',
				[
						
						'LoginService',
						'WebSocketService',
						'$scope','$interval',
						
						
						function( LoginService,WebSocketService, $scope, $interval) {
							
							$scope.chatMessage={action:"chatMessageLobby"};
							var username = LoginService.getUserLoggedIn().username;
							
							var socket={};
							var queryPlayersInterval;
							$scope.messages=[];
							$scope.countOfPlayersOnline=0;
							
							$scope.sendChatMessage = function(){
								$scope.chatMessage.author=username;
								socket.send(JSON.stringify($scope.chatMessage));
							}
							
							$scope.config = {
								    autoHideScrollbar: false,
								    theme: '3d',
								    advanced:{
								        updateOnContentResize: true
								    },
								        setHeight: 300,
								        scrollInertia: 0,
								        scrollButtons: {
						                    scrollAmount: 'auto', // scroll amount when button pressed
						                    enable: true // enable scrolling buttons by default
						                }
								    };
							
							$scope.displayChatMessage = function(message){
								var size=$scope.messages.length;
								message.date=new Date();
								$scope.messages.unshift(message);
								$scope.$apply();
								
								
							}
							
							function queryPlayersOnline(){
								socket.send(JSON.stringify({user:username,action:"queryPlayersOnline"}));
							}
							
							function onMessage(event) {
								console.log(event);
								var data = JSON.parse(event.data);
								if (data.action == "chatMessageLobby") {
									$scope.displayChatMessage(data);
								}
								if (data.action == "countOfPlayersOnline") {
									$scope.countOfPlayersOnline=data.count;
								}
								
						}
							
							var init = function(){
								socket=WebSocketService.initWebSockets();
								socket.onmessage=onMessage;
								socket.onclose=function(event){
									$interval.cancel(queryPlayersInterval);
								};
								console.log(LoginService.getUserLoggedIn());
								
								queryPlayersInterval=$interval(queryPlayersOnline,5000);
						
								}
							
							init();
						}]);