'use strict';

angular
		.module(
				'myApp.BoardModule',
				[ 'ngRoute', 'ui.bootstrap', 'reservationFilters', 'constants' ])

		.controller(
				'BoardCtrl',
				[
						'ReservationService',
						'LoginService',
						'$scope',
						'$rootScope',
						'$modal',
						'$q',
						'$http',
						'$timeout',
						function(ReservationService, LoginService, $scope,
								$rootScope, $modal, $q, $http, $timeout) {

							var chessboard;
							var squareSize;
							var startPosition;
							var endPosition;
							var moveNumber;
							var initialised;
							var socket;
							var user;
							var clockTimer;
							
							$scope.squareSize=squareSize;
							$scope.playingGame = null;
							$scope.oponent = null;
							$scope.whitePlayer = null;
							$scope.time = null;
							$scope.increment = null;
							$scope.myMove = null;
							$scope.whitePlayerName = null;
							$scope.blackPlayerName = null;
							$scope.gameResult= null;
							
							$scope.initialisationComplete=function(){
								$scope.$apply(function(){
									//console.log("Setting newGame to false;");
									$scope.newGame=false;});
								
							};
							
							$scope.setMyMove=function(isItMyMove){
								$scope.myMove=isItMyMove;
							}

							var getChessboardCoordinates = function(obj) {
								var top;
								top = 0;
								if (obj.offsetParent) {
									do {

										top += obj.offsetTop;
									} while (obj = obj.offsetParent);
								}
								//console.log(chessboard);
								chessboard.coordinates.left = chessboard.element
										.getBoundingClientRect().left;
								chessboard.coordinates.right = chessboard.element
										.getBoundingClientRect().right;
								chessboard.coordinates.bottom = chessboard.element
										.getBoundingClientRect().bottom;
								chessboard.coordinates.top = top;
								// TODO squareSize =
								// (chessboard.coordinates.right -
								// chessboard.coordinates.left) / 8;
								squareSize = 55;
								//console.log("Square size:" + squareSize);
								//console.log(chessboard.coordinates);
							};

							$scope.determineRowColumn = function(x, y,
									whitePlayer) {
								//console.log(squareSize);
								//console.log(chessboard.coordinates)

								var coordinates = {};
								coordinates.x = (x - chessboard.coordinates.left)
										/ squareSize;
								coordinates.y = 8 - ((y - (chessboard.coordinates.top)) / squareSize);
								var row = !whitePlayer ? 7 - Math
										.floor(coordinates.y) : Math
										.floor(coordinates.y);
								var column = !whitePlayer ? 7 - Math
										.floor(coordinates.x) : Math
										.floor(coordinates.x);

								return {
									row : row,
									column : column,
									piece : chessboard.squares[findIndexOfSquare(
											column, row)].piece
								};

							}

							function getInitialPositionOfPiece(piece) {
								var coordinates = {};
								for (var index = 0; index < chessboard.pieces.length; index++) {
									if (chessboard.pieces[index].name === piece) {
										coordinates.row = chessboard.pieces[index].row;
										coordinates.column = chessboard.pieces[index].column;
										return coordinates;
									}
								}

							}

							$scope.updateChessboardAfterMove = function(
									element, startPosition, endPosition,
									ownMove, whitePlayer) {

								var capture = false;
								var top = ((((getInitialPositionOfPiece(startPosition.piece).row) - endPosition.row) * squareSize) + (0.13 * squareSize));
								var left = (((endPosition.column - (getInitialPositionOfPiece(startPosition.piece)).column) * squareSize) + (0.13 * squareSize));

								element.css({

									top : whitePlayer ? top + 'px' : (top
											* (-1) + (0.26 * squareSize))
											+ 'px',
									left : whitePlayer ? left + 'px' : (left
											* (-1) + (0.26 * squareSize))
											+ 'px',

								});

								var startSquareIndex = findIndexOfSquare(
										startPosition.column, startPosition.row);
								var endSquareIndex = findIndexOfSquare(
										endPosition.column, endPosition.row);
								chessboard.squares[startSquareIndex].piece = "empty";
								if (chessboard.squares[endSquareIndex].piece !== "empty") {
									capture = true;
									$("#"+ chessboard.squares[endSquareIndex].piece).hide();

								}

								chessboard.squares[endSquareIndex].piece = startPosition.piece;
								var annotatedMove = addAnnotation(
										chessboard.squares[endSquareIndex].piece,
										startSquareIndex, endSquareIndex,
										capture, false, false);
								if (ownMove) {
									sendMove(
											chessboard.squares[endSquareIndex].piece,
											startPosition, endPosition);
								}
							}

							function addAnnotation(piece, startSquareIndex,
									endSquareIndex, capture, promotion, castle) {
								var startSquare = String
										.fromCharCode(97 + chessboard.squares[startSquareIndex].column)
										+ (chessboard.squares[startSquareIndex].row + 1);
								//console.log(piece, endSquareIndex, capture,	promotion, castle, startSquare);
								var pieceSymbol = piece.indexOf("P") != -1 ? capture ? startSquare
										.substr(0, 1)
										: ""
										: piece.substr(1, 1);
								var captureSymbol = capture ? "x" : "";
								var promotionSymbol = promotion == true ? "TODO"
										: " ";
								//console.log(promotion);
								var square = String
										.fromCharCode(97 + chessboard.squares[endSquareIndex].column)
										+ (chessboard.squares[endSquareIndex].row + 1);
								var moveNotation = pieceSymbol + captureSymbol
										+ square + promotionSymbol;
								//console.log(moveNumber);
								var whiteMove = piece.indexOf("W") != -1;
								var movecomplete;
								if (whiteMove) {
									chessboard.annotatedMoves[moveNumber] = {};

									chessboard.annotatedMoves[moveNumber].white = moveNotation;
									chessboard.annotatedMoves[moveNumber].black = "";
									chessboard.annotatedMoves[moveNumber].number = moveNumber + 1;
									// $('.notationTable tbody
									// tr:last').after('<tr><td>'+moveNumber+'</td><td>'+moveNotation+'</td></tr>');
									//console.log(chessboard.annotatedMoves);
									movecomplete = false;
								} else {

									//console.log(chessboard.annotatedMoves);
									chessboard.annotatedMoves[moveNumber].black = moveNotation;

									//console.log("incremented moveNumber:"+ moveNumber);
									movecomplete = true;
								}
								if (movecomplete) {
									moveNumber++;
								}
								$scope
										.$apply(function() {
											$scope.annotatedMoves = chessboard.annotatedMoves;
									
										});
								return moveNotation;
								// $(".notationtable")

							}

							function findIndexOfSquare(x, y) {
								//console.log(x, y);
								for (var index = 0; index < chessboard.squares.length; index++) {
									if (chessboard.squares[index].column == x
											&& chessboard.squares[index].row == y) {
										//console.log("Returning index:" + index);
										return index;
									}
								}
							}
							
							var calculateEloChange=function(elowhite, eloblack, gameResultWhite, gameResultBlack){
								//console.log(elowhite, eloblack, gameResultWhite, gameResultBlack);
								var expectedOutcomeWhite = 1 / (1+Math.pow(10,(eloblack-elowhite)/400));
								var expectedOutcomeBlack = 1 / (1+Math.pow(10,(elowhite-eloblack)/400));
								var newRatingWhite = Math.round(elowhite + 15*(gameResultWhite-expectedOutcomeWhite));
								var newRatingBlack = Math.round(eloblack + 15*(gameResultBlack-expectedOutcomeBlack));
								//console.log(expectedOutcomeWhite, expectedOutcomeBlack,newRatingWhite, newRatingBlack);
								
								return {"newRatingWhite":newRatingWhite, "newRatingBlack":newRatingBlack};
								
							}

							var initialiseChessboard = function() {
								//console.log("Initialising chessboard.");
								chessboard.coordinates = {};
								chessboard.annotatedMoves = [];
								getChessboardCoordinates(chessboard.element);

								var index = 0;
								var pieceIndex = 0;
								var squares = [];
								var piece;
								for (var x = 0; x <= 7; x++) {
									for (var y = 0; y <= 7; y++) {
										piece = "";
										squares[index] = {};
										squares[index].row = y;
										squares[index].column = x;
										if (y == 6) {

											piece = "BP" + x + y;

										} else if (y == 1) {
											piece = "WP" + x + y;
										} else if (y == 0) {
											if (x == 0 || x == 7) {
												piece = "WR" + x + y;
											} else if (x == 1 || x == 6) {
												piece = "WN" + x + y;
											} else if (x == 2 || x == 5) {
												piece = "WB" + x + y;
											} else if (x == 3) {
												piece = "WQ" + x + y;
											} else if (x == 4) {
												piece = "WK" + x + y;
											}
										} else if (y == 7) {
											if (x == 0 || x == 7) {
												piece = "BR" + x + y;
											} else if (x == 1 || x == 6) {
												piece = "BN" + x + y;
											} else if (x == 2 || x == 5) {
												piece = "BB" + x + y;
											} else if (x == 3) {
												piece = "BQ" + x + y;
											} else if (x == 4) {
												piece = "BK" + x + y;
											}
										}
										if (piece !== "") {
											squares[index].piece = piece;
											chessboard.pieces[pieceIndex] = {};
											chessboard.pieces[pieceIndex].row = y;
											chessboard.pieces[pieceIndex].column = x;
											chessboard.pieces[pieceIndex].name = piece;
											pieceIndex++;
										} else {
											squares[index].piece = "empty";
										}
										index++;
									}
								}

								chessboard.squares = squares;
								//console.log("Squares scope.initialised.");
								//console.log(chessboard.squares);
								//console.log("Pieces scope.initialised.");
								//console.log(chessboard.pieces);
							
								initialised = true;
							
							}

							var initialiseWebSockets = function() {
								socket = new WebSocket(
										"ws://localhost:8082/actions");
								socket.onmessage = onMessage;
								socket.onerror = onError;

								function onError(event) {
									//console.log("Error occured:" + event);

								}

								function onMessage(event) {
									//console.log(event);
									var data = JSON.parse(event.data);
									if (data.action == "move") {
										executeReceivedMove(data);
									} else if (data.action == "startGame") {
										startGame(data);
									}
									else if (data.action == "offerDraw") {
										//console.log("Received draw offer.");
										displayDrawOffer();
									}
									else if (data.action == "drawOfferReply"){
										if(data.acceptDraw==true){
										stopClocks();
										$scope.$apply(function() {
										$scope.endGame("1/2 - 1/2");
										$scope.whitePlayerElo = $scope.whitePlayer?data.myNewElo:data.oponentsNewElo;
										$scope.blackPlayerElo = !$scope.whitePlayer?data.myNewElo:data.oponentsNewElo;
										});
										}
										else{
											
										}
									}
									else if (data.action == "resign") {
										//console.log("Received oponent's resignation");
										stopClocks();
										$scope.$apply(function() {
											$scope.endGame($scope.whitePlayer?"1-0":"0-1");
											$scope.whitePlayerElo = $scope.whitePlayerName===data.player?data.myNewElo:data.oponentsNewElo;
											$scope.blackPlayerElo = $scope.blackPlayerName===data.player?data.myNewElo:data.oponentsNewElo;
										});
										
									}
								}
							}
							
							var displayDrawOffer=function(){
								//console.log("displaying draw offer");
								$scope.drawOfferReceived = true;
							};

							var executeReceivedMove = function(data) {
								
								//console.log("Received move:" + event.data);
								var moveInfo = JSON.parse(data.moveInfo);
								//console.log(moveInfo.element);

								$scope.updateChessboardAfterMove($("#"
										+ moveInfo.element),
										moveInfo.startPosition,
										moveInfo.endPosition, false,
										$scope.whitePlayer);
								$scope.pressClock($scope.whitePlayer);
								$scope.myMove=true;

							}
							var generateClockTimeFromSeconds = function(seconds) {
								var clockSeconds = seconds % 60;
								if (clockSeconds < 10) {
									clockSeconds = "0" + clockSeconds
								}
								var clockMinutes = Math.floor(seconds / 60);
								var clockTime = clockMinutes + ":"
										+ clockSeconds;

								return clockTime
							};

							$scope.onTimeout = function(whitePlayer) {
								// //console.log("updatingLog:"+new Date());
								if (whitePlayer) {
									if ($scope.whiteTime > 0) {
										$scope.whiteTime -= 1;
										$scope.whiteClock = generateClockTimeFromSeconds($scope.whiteTime);
									}
									else{						
										$scope.playingGame=false;
										$scope.gameResult = "0-1";
										stopClocks();
									}
								} else {
									if ($scope.blackTime > 0) {
										$scope.blackTime -= 1;
										$scope.blackClock = generateClockTimeFromSeconds($scope.blackTime);
									}
									else {
										
										$scope.playingGame=false;
										$scope.gameResult = "1-0";
										stopClocks();
									}
								}
								clockTimer = $timeout(function() {
									$scope.onTimeout(whitePlayer)
								}, 1000);

							}

							var startClock = function(whitePlayer) {
								//console.log("Starting clock for whitePlayer:"+ whitePlayer);
								clockTimer = $timeout($scope
										.onTimeout(whitePlayer), 1000);

							}

							$scope.pressClock = function(whitePlayer) {
								//console.log("Pressing clock");
								$timeout.cancel(clockTimer);
								startClock(whitePlayer);
							}
							
							var stopClocks = function() {
								//console.log("Stopping clock");
								$timeout.cancel(clockTimer);
								
							}

							var startGame = function(data) {
								$(".chessPiece").show();
								moveNumber=0;
								$scope.playingGame = true;
								$scope.gameResult = "";
								$scope.whiteTime = data.time * 60;
								$scope.blackTime = data.time * 60;
								$scope.drawOfferReceived=false;
								$scope.whitePlayerElo = data.whitePlayerElo;
								$scope.blackPlayerElo = data.blackPlayerElo;
								$scope.whitePlayerName = data.whitePlayer;
								$scope.blackPlayerName = data.blackPlayer;
								$scope.whiteClock = generateClockTimeFromSeconds($scope.whiteTime);
								$scope.blackClock = generateClockTimeFromSeconds($scope.blackTime);
								//console.log("Starting game.");
								//console.log(data.blackPlayer, user.username);
								
								$scope.$apply(function(){
									
									
									//console.log("nulling annotated moves");
									$scope.annotatedMoves=[];
									//console.log("Setting newGame to true;");
									
									initPage();
									$scope.newGame=true;
								});
								
								if (data.blackPlayer == user.username) {
									

									//console.log("I am the black player.")
									$scope.$apply(function() {
										$scope.oponent = data.whitePlayer;
										$scope.whitePlayer = false;
										//initialiseWebSockets();
									});

								} else {
									
									
									$scope.$apply(function() {
										$scope.oponent = data.blackPlayer;
										$scope.whitePlayer = true;
										$scope.myMove=true;
										
										
									});
								}
								//console.log("My oponent is:" + $scope.oponent);
								startClock(true);

							};
							
							$scope.endGame=function(gameResult){
								var gameResultWhite;
								var gameResultBlack;
								if (gameResult==="1-0"){
									gameResultWhite=1;
									gameResultBlack=0;
								}
								else if (gameResult==="0-1"){
									gameResultWhite=0;
									gameResultBlack=1;
								}
								else if (gameResult==="1/2 - 1/2"){
									gameResultWhite=0.5;
									gameResultBlack=0.5;
								}
								stopClocks();							
								$scope.playingGame=false;
								var newElos=calculateEloChange($scope.whitePlayerElo, $scope.blackPlayerElo, gameResultWhite,gameResultBlack);
								$scope.gameResult = gameResult;
								
								return newElos;
								
								
							}
							
							$scope.offerDraw=function(){
								var drawOffer = {
										action : "offerDraw",
										oponent : $scope.oponent
								}
								//console.log("sending draw offer to server");
								socket.send(JSON.stringify(drawOffer));
							}
							
							$scope.drawOfferReply=function(acceptDraw){
								var drawOffer = {
										action : "drawOfferReply",
										player : user.username,
										oponent : $scope.oponent,
										acceptDraw: acceptDraw
								}
								//console.log("sending drawOfferReply to server");
								
								if (acceptDraw){
									var newElos=$scope.endGame("1/2 - 1/2");
									var myNewElo=$scope.whitePlayer?newElos.newRatingWhite:newElos.newRatingBlack;
									var oponentsNewElo=!$scope.whitePlayer?newElos.newRatingWhite:newElos.newRatingBlack;
									$scope.whitePlayerElo = $scope.whitePlayer?myNewElo:oponentsNewElo;
									$scope.blackPlayerElo = !$scope.whitePlayer?myNewElo:oponentsNewElo;
									drawOffer.myNewElo = myNewElo;
									drawOffer.oponentsNewElo =oponentsNewElo;
//									stopClocks();
									$scope.playingGame=false;
//									$scope.gameResult = $scope.gameResult = "1/2 - 1/2";
								}
								//console.log(drawOffer);
								socket.send(JSON.stringify(drawOffer));
							}
							
							$scope.resign=function(){
								var newElos=$scope.endGame(!$scope.whitePlayer?"1-0":"0-1");
								var myNewElo=$scope.whitePlayer?newElos.newRatingWhite:newElos.newRatingBlack;
								var oponentsNewElo=!$scope.whitePlayer?newElos.newRatingWhite:newElos.newRatingBlack;
								var resignation = {
										action : "resign",
										player: user.username,
										oponent : $scope.oponent,
										myNewElo : myNewElo,
										oponentsNewElo:oponentsNewElo
								};
								
								$scope.whitePlayerElo = $scope.whitePlayer?myNewElo:oponentsNewElo;
								$scope.blackPlayerElo = !$scope.whitePlayer?myNewElo:oponentsNewElo;
								//$scope.newGame=false;
								
								socket.send(JSON.stringify(resignation));
								
								
//								stopClocks();
//								
							$scope.playingGame=false;
//								$scope.gameResult = !$scope.whitePlayer?"1-0":"0-1";
								
							}

							$scope.seekOponent = function() {
								//console.log("Sending seek to server.");
								var seekDetails = {

									action : "seekOponent",
									user : LoginService.getUserLoggedIn().username,
									time : parseInt($scope.time),
									increment : parseInt($scope.increment)

								}
								//console.log(seekDetails.time,seekDetails.increment)
								socket.send(JSON.stringify(seekDetails));
							}

							var sendMove = function(element, startPosition,
									endPosition) {

								var moveAction = {
									action : "move",
									element : element,
									oponent : $scope.oponent,
									startPosition : startPosition,
									endPosition : endPosition,

								};
								//console.log(socket);
								socket.send(JSON.stringify(moveAction));
								//console.log("sending move");
								//console.log(moveAction);
							}
							
							$scope.$watch("newGame", function(value) {
								console.log("newGame changed:" + value);
								if (value==true){
								//	initPage();
								}
							});
							

//							$scope.$watch("whitePlayer", function(value) {
//								//console.log("hello from watch.:" + value);
//								// I change here
//								var val = value || null;
//								if (val) {
//								//	initPage();
//								}
//							});

							var initPage = function() {
								$timeout(function() {
									chessboard = {};
									//console.log("Getting element.");
									chessboard.element = document
											.getElementsByName("chessboardTable")[0];
									//console.log(chessboard.element);
									chessboard.pieces = [];
									chessboard.annotatedMoves=[];
									squareSize = 0;
									startPosition = {};
									endPosition = {};
									initialised = false;
									moveNumber = 0;
									user = LoginService.getUserLoggedIn();

									initialiseChessboard();
									initialiseWebSockets();
								});
							}

							var init = function() {

								////console.log("initialising controller");

								$timeout(function() {
									$scope.$apply(function() {
										initPage();
										////console.log("Setting whitePlayer");
										$scope.whitePlayer = true;
										
									});
								})

							};

							init();
						} ]);