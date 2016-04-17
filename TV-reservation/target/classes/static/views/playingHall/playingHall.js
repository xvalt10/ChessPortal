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
							var enPassant;
							var element;
							$scope.lastMove={};

							$scope.squareSize = squareSize;
							$scope.playingGame = null;
							$scope.oponent = null;
							$scope.whitePlayer = null;
							$scope.time = null;
							$scope.increment = null;
							$scope.myMove = null;
							$scope.whitePlayerName = null;
							$scope.blackPlayerName = null;
							$scope.gameResult = null;
							$scope.promotionSquareReached=false;

							$scope.initialisationComplete = function() {
								$scope.$apply(function() {
									// console.log("Setting newGame to false;");
									$scope.newGame = false;
								});

							};

							$scope.setMyMove = function(isItMyMove) {
								$scope.myMove = isItMyMove;
							}

							var getChessboardCoordinates = function(obj) {
								var top;
								top = 0;
								if (obj.offsetParent) {
									do {

										top += obj.offsetTop;
									} while (obj = obj.offsetParent);
								}
								// console.log(chessboard);
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
								// console.log("Square size:" + squareSize);
								// console.log(chessboard.coordinates);
							};

							$scope.determineRowColumn = function(x, y,
									whitePlayer) {
								// console.log(squareSize);
								// console.log(chessboard.coordinates)

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

							$scope.getInitialPositionOfPiece=function(piece) {
								console.log(piece);
								var coordinates = {};
								for (var index = 0; index < chessboard.pieces.length; index++) {
									if (chessboard.pieces[index].piece === piece) {
										coordinates.row = chessboard.pieces[index].row;
										coordinates.column = chessboard.pieces[index].column;
										return coordinates;
									}
								}

							}
							;
							
							function isRookMoveLegal(startPosition, endPosition){
								var isLegal = true;
								if (endPosition.row==startPosition.row){
									for (var x =1;x<Math.abs(endPosition.column-startPosition.column);x++){
										if(
										chessboard.squares[findIndexOfSquare(endPosition.column>startPosition.column?startPosition.column+x:startPosition.column-x, startPosition.row)].piece !== "empty"){
											isLegal =false;
										}
											}
									
										}
								else if (endPosition.column == startPosition.column){
									for (var x =1;x<Math.abs(endPosition.row-startPosition.row);x++){
										if(
										chessboard.squares[findIndexOfSquare(startPosition.column,endPosition.row>startPosition.row?startPosition.row+x:startPosition.row-x)].piece !== "empty"){
											isLegal =false;
										}
											}
								}
								else {
									isLegal=false;
								}
								console.log("Rook move legal:"+isLegal);
								return isLegal;
							};
							
							function isPawnMoveLegal(startPosition, endPosition, whitePlayer){
								if (Math.abs(startPosition.row-endPosition.row)>2 || Math.abs(startPosition.column-endPosition.column)>1 ){
									return false;
								}else if(Math.abs(!whitePlayer?startPosition.row-endPosition.row:endPosition.row-startPosition.row)==1 && Math.abs(startPosition.column-endPosition.column)==1 && (endPosition.piece != "empty" ) ){
									return true;}
								else if(Math.abs(!whitePlayer?startPosition.row-endPosition.row:endPosition.row-startPosition.row)==1 && startPosition.column-endPosition.column==0){
									return true;
								}
								else if(Math.abs(!whitePlayer?startPosition.row-endPosition.row:endPosition.row-startPosition.row)==2 && startPosition.column-endPosition.column==0){
									var initialPositionOfPiece=$scope.getInitialPositionOfPiece(startPosition.piece);
									if (startPosition.row==initialPositionOfPiece.row && startPosition.column==initialPositionOfPiece.column){
										return true;
									}
									else{
									return false;}
								}
								else if (!whitePlayer?startPosition.row-endPosition.row:endPosition.row-startPosition.row==1  && Math.abs(endPosition.column-startPosition.column)==1){
									return pieceTakenEnPassant(startPosition, endPosition, whitePlayer, $scope.lastMove);
									
								}
							}
							
							function pieceTakenEnPassant(startPosition, endPosition, whitePlayer, lastMove){
								console.log("En passant function called.");
								console.log(startPosition.piece.indexOf("P")!=-1);
								var squaresMovedForward;
								if ($scope.myMove==true){
								squaresMovedForward=!whitePlayer?startPosition.row-endPosition.row:endPosition.row-startPosition.row;}
								else {
								squaresMovedForward = Math.abs(startPosition.row-endPosition.row);
								}
								console.log(squaresMovedForward,$scope.myMove);
								console.log(Math.abs(endPosition.column-startPosition.column)==1);
								if (startPosition.piece.indexOf("P")!=-1 && squaresMovedForward==1  && Math.abs(endPosition.column-startPosition.column)==1){
									console.log(lastMove);
									if($scope.lastMove.startPosition.piece.indexOf("P")!=-1 && Math.abs($scope.lastMove.startPosition.row - $scope.lastMove.endPosition.row) ==2 && $scope.lastMove.endPosition.column == endPosition.column){
										console.log("En passant.");
										enPassant=true;
										return true;
									}
									else false;
									
								}
							}
							
							function isKingMoveLegal(startPosition, endPosition, whitePlayer){
								if(Math.abs(endPosition.row-startPosition.row)<=1 && Math.abs(endPosition.column-startPosition.column)<=1){
									return true;
								}
								else return false;
							}
							
							function isBishopMoveLegal(startPosition, endPosition, whitePlayer){
								var isLegal=true;
								if (Math.abs(endPosition.row-startPosition.row)==Math.abs(endPosition.column-startPosition.column)
										//&& (whitePlayer ? endPosition.piece.indexOf("W") == -1: endPosition.piece.indexOf("B") == -1)
												){
									if (endPosition.row>startPosition.row && endPosition.column>startPosition.column){
										for (var x =1;x<endPosition.row-startPosition.row;x++){
											if(
											chessboard.squares[findIndexOfSquare(startPosition.column+x, startPosition.row+x)].piece !== "empty"){
												console.log("Case1");
												isLegal=false;break;
											};
											
										}
										
									}
									else if (endPosition.row>startPosition.row && endPosition.column<startPosition.column){
										for (var x =1;x<endPosition.row-startPosition.row;x++){
											if(
											chessboard.squares[findIndexOfSquare(endPosition.column+x, endPosition.row-x)].piece !== "empty"){
												console.log("Case2");
												console.log(chessboard.squares[findIndexOfSquare(endPosition.column+x, startPosition.row+x)].piece);
												
												isLegal=false;break;
											};
											
										}
										
									}
									else if (endPosition.row<startPosition.row && endPosition.column>startPosition.column){
										for (var x =1;x<startPosition.row-endPosition.row;x++){
											if(
											chessboard.squares[findIndexOfSquare(endPosition.column-x, endPosition.row+x)].piece !== "empty"){
												console.log("Case3");
												isLegal=false;break;
											};
											
										}
										
									}
									else if (endPosition.row<startPosition.row && endPosition.column<startPosition.column){
										for (var x =1;x<startPosition.row-endPosition.row;x++){
											if(
											chessboard.squares[findIndexOfSquare(endPosition.column+x, endPosition.row+x)].piece !== "empty"){
												console.log("Case4");
												isLegal=false;break;
											};
											
										}
										
									}
									
								}
								else{
									console.log("Case 5");
									isLegal= false;
								}
								console.log("Bishop move legal:"+isLegal);
								return isLegal;
							};
							

							$scope.checkLegalityOfMove = function(
									startPosition, endPosition,
									whitePlayer) {
								if (endPosition.row==startPosition.row && endPosition.column==startPosition.column){
									return false;
								}
								
//								console.log("Checking legality of piece:"
//										+ startPosition.piece.substr(1, 1)
//										+ " " + topPiece);
								switch (startPosition.piece.substr(1, 1)) {
								case "N":

									if (((Math.abs(startPosition.row
											- endPosition.row) == 2 && Math
											.abs(startPosition.column
													- endPosition.column) == 1) || (Math
											.abs(startPosition.row
													- endPosition.row) == 1 && Math
											.abs(startPosition.column
													- endPosition.column) == 2))
											&& (whitePlayer ? endPosition.piece
													.indexOf("W") == -1
													: endPosition.piece
															.indexOf("B") == -1)) {
										console.log("Legal knight move");
										return true;
									} else {

									
										console.log("Illegal knight move");
										return false;
									}
									break;
									
								case "P":
									return isPawnMoveLegal(startPosition, endPosition, whitePlayer);
									break;
								case "K":
									return isKingMoveLegal(startPosition, endPosition, whitePlayer);
									break;
								case "B":
									return isBishopMoveLegal(startPosition, endPosition, whitePlayer);
									break;								
								case "R":
									return isRookMoveLegal(startPosition, endPosition);
									break;
								case "Q":
									return isBishopMoveLegal(startPosition, endPosition) || isRookMoveLegal(startPosition, endPosition);
									break;
								default:
									return true;
								}

							};
							
							function isKingInCheck(chessBoard, whiteMove, startPosition, endPosition){
								endPosition.piece=startPosition.piece;
								var kingPosition={};
								var kingInCheck=false;
								
								chessboard.squares.forEach(function(square){
									if (endPosition.piece.indexOf("W")!=-1?square.piece.indexOf("BK")!=-1:square.piece.indexOf("WK")!=-1){
									kingPosition.row=square.row;
									kingPosition.column=square.column;
									kingPosition.piece=square.piece;
								}
									
								});
								console.log("Is king in check check");
								console.log(endPosition);
								console.log(kingPosition);
								return $scope.checkLegalityOfMove(endPosition, kingPosition, $scope.whitePlayer);
								
//								
//								chessboard.pieces.forEach(function(piece){
//									
//									if($scope.whitePlayer && piece.piece.indexOf("W")!=-1 && $scope.checkLegalityOfMove(piece,kingPosition, $scope.whitePlayer)==true){
//										console.log("Black king in check.");
//										console.log(piece);
//										kingInCheck=true;
//										
//									}
//									else if (!$scope.whitePlayer && piece.piece.indexOf("B")!=-1 && $scope.checkLegalityOfMove(piece,kingPosition, $scope.whitePlayer)==true){
//										
//										console.log("White king in check.");
//										console.log(piece);
//										kingInCheck = true;
//										
//									}
//								});
								//return kingInCheck;
							};
							
							

							$scope.updateChessboardAfterMove = function(element,
									startPosition, endPosition,ownMove,
									 whitePlayer, promotedPiece) {
								console.log(startPosition);
						/*	if (ownMove){*/
								var kingInCheck = isKingInCheck(chessboard, $scope.whiteMove, startPosition,endPosition);
								/*}*/
								var capture = false;
								var top = (((($scope.getInitialPositionOfPiece(startPosition.piece).row) - endPosition.row) * squareSize) + (0.13 * squareSize));
								var left = (((endPosition.column - ($scope.getInitialPositionOfPiece(startPosition.piece)).column) * squareSize) + (0.13 * squareSize));

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
								if (chessboard.squares[endSquareIndex].piece !== "empty" || pieceTakenEnPassant(startPosition, endPosition, whitePlayer, $scope.lastMove)==true) {
									capture = true;
									console.log("EnPassant:"+enPassant);
									if (enPassant==true){
										var indexSquareEnPassantTakenPiece =findIndexOfSquare(
												endPosition.column, $scope.myMove?whitePlayer?endPosition.row-1:endPosition.row+1:!whitePlayer?endPosition.row-1:endPosition.row+1) 
										$("#"+ chessboard.squares[indexSquareEnPassantTakenPiece].piece).hide();
										chessboard.squares[indexSquareEnPassantTakenPiece].piece = "empty";
										enPassant=false;
									}
									else{
									$("#"+ chessboard.squares[endSquareIndex].piece).hide();
									}
									

								}
								console.log("PromotedPiece");
								console.log(promotedPiece);
								if(typeof promotedPiece != 'undefined'){
									console.log("Promoting to:"+promotedPiece);
									console.log(element);
									chessboard.squares[endSquareIndex].piece = promotedPiece;
								}
								else{
									//TODO Exact piece name has to be added
								chessboard.squares[endSquareIndex].piece = startPosition.piece;
								}
								var annotatedMove = addAnnotation(
										chessboard.squares[endSquareIndex].piece,
										startSquareIndex, endSquareIndex,
										capture, false, false, kingInCheck);
								if (ownMove) {
									sendMove(
											chessboard.squares[endSquareIndex].piece,
											startPosition, endPosition);
								}
							}

							function addAnnotation(piece, startSquareIndex,
									endSquareIndex, capture, promotion, castle, check) {
								var startSquare = String
										.fromCharCode(97 + chessboard.squares[startSquareIndex].column)
										+ (chessboard.squares[startSquareIndex].row + 1);
								// console.log(piece, endSquareIndex, capture,
								// promotion, castle, startSquare);
								var pieceSymbol = piece.indexOf("P") != -1 ? capture ? startSquare
										.substr(0, 1)
										: ""
										: piece.substr(1, 1);
								var captureSymbol = capture ? "x" : "";
								var promotionSymbol = promotion == true ? "TODO"
										: " ";
								var checkSymbol = check?"+":"";
								// console.log(promotion);
								var square = String
										.fromCharCode(97 + chessboard.squares[endSquareIndex].column)
										+ (chessboard.squares[endSquareIndex].row + 1);
								var moveNotation = pieceSymbol + captureSymbol
										+ square + promotionSymbol+checkSymbol;
								// console.log(moveNumber);
								var whiteMove = piece.indexOf("W") != -1;
								var movecomplete;
								if (whiteMove) {
									chessboard.annotatedMoves[moveNumber] = {};

									chessboard.annotatedMoves[moveNumber].white = moveNotation;
									chessboard.annotatedMoves[moveNumber].black = "";
									chessboard.annotatedMoves[moveNumber].number = moveNumber + 1;
									// $('.notationTable tbody
									// tr:last').after('<tr><td>'+moveNumber+'</td><td>'+moveNotation+'</td></tr>');
									// console.log(chessboard.annotatedMoves);
									movecomplete = false;
								} else {

									// console.log(chessboard.annotatedMoves);
									chessboard.annotatedMoves[moveNumber].black = moveNotation;

									// console.log("incremented moveNumber:"+
									// moveNumber);
									movecomplete = true;
								}
								if (movecomplete) {
									moveNumber++;
								}
								$scope.annotatedMoves = chessboard.annotatedMoves;
								/*$scope
										.$apply(function() {
										

										});*/
								return moveNotation;
								// $(".notationtable")

							}

							function findIndexOfSquare(x, y) {
								// console.log(x, y);
								for (var index = 0; index < chessboard.squares.length; index++) {
									if (chessboard.squares[index].column == x
											&& chessboard.squares[index].row == y) {
										// console.log("Returning index:" +
										// index);
										return index;
									}
								}
							}

							var calculateEloChange = function(elowhite,
									eloblack, gameResultWhite, gameResultBlack) {
								// console.log(elowhite, eloblack,
								// gameResultWhite, gameResultBlack);
								var expectedOutcomeWhite = 1 / (1 + Math.pow(
										10, (eloblack - elowhite) / 400));
								var expectedOutcomeBlack = 1 / (1 + Math.pow(
										10, (elowhite - eloblack) / 400));
								var newRatingWhite = Math
										.round(elowhite
												+ 15
												* (gameResultWhite - expectedOutcomeWhite));
								var newRatingBlack = Math
										.round(eloblack
												+ 15
												* (gameResultBlack - expectedOutcomeBlack));
								// console.log(expectedOutcomeWhite,
								// expectedOutcomeBlack,newRatingWhite,
								// newRatingBlack);

								return {
									"newRatingWhite" : newRatingWhite,
									"newRatingBlack" : newRatingBlack
								};

							}

							var initialiseChessboard = function() {
								// console.log("Initialising chessboard.");
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
											chessboard.pieces[pieceIndex].piece = piece;
											pieceIndex++;
										} else {
											squares[index].piece = "empty";
										}
										index++;
									}
								}

								chessboard.squares = squares;
								// console.log("Squares scope.initialised.");
								// console.log(chessboard.squares);
								// console.log("Pieces scope.initialised.");
								// console.log(chessboard.pieces);

								initialised = true;

							}

							var initialiseWebSockets = function() {
								socket = new WebSocket(
										"ws://localhost:8082/actions");
								socket.onmessage = onMessage;
								socket.onerror = onError;

								function onError(event) {
									// console.log("Error occured:" + event);

								}

								function onMessage(event) {
									// console.log(event);
									var data = JSON.parse(event.data);
									if (data.action == "move") {
										executeReceivedMove(data);
									} else if (data.action == "startGame") {
										startGame(data);
									} else if (data.action == "offerDraw") {
										// console.log("Received draw offer.");
										displayDrawOffer();
									} else if (data.action == "drawOfferReply") {
										if (data.acceptDraw == true) {
											stopClocks();
											$scope
													.$apply(function() {
														$scope
																.endGame("1/2 - 1/2");
														$scope.whitePlayerElo = $scope.whitePlayer ? data.myNewElo
																: data.oponentsNewElo;
														$scope.blackPlayerElo = !$scope.whitePlayer ? data.myNewElo
																: data.oponentsNewElo;
													});
										} else {

										}
									} else if (data.action == "resign") {
										// console.log("Received oponent's
										// resignation");
										stopClocks();
										$scope
												.$apply(function() {
													$scope
															.endGame($scope.whitePlayer ? "1-0"
																	: "0-1");
													$scope.whitePlayerElo = $scope.whitePlayerName === data.player ? data.myNewElo
															: data.oponentsNewElo;
													$scope.blackPlayerElo = $scope.blackPlayerName === data.player ? data.myNewElo
															: data.oponentsNewElo;
												});

									}
								}
							}

							var displayDrawOffer = function() {
								// console.log("displaying draw offer");
								$scope.drawOfferReceived = true;
							};

							var executeReceivedMove = function(data) {

								// console.log("Received move:" + event.data);
								var lastReceivedMove = JSON.parse(data.moveInfo);
								// console.log(moveInfo.element);

								$scope.updateChessboardAfterMove($("#"
										+ lastReceivedMove.element),
										lastReceivedMove.startPosition,
										lastReceivedMove.endPosition, false,
										$scope.whitePlayer);
								$scope.lastMove=lastReceivedMove;
								$scope.pressClock($scope.whitePlayer);
								$scope.myMove = true;

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
									} else {
										$scope.playingGame = false;
										$scope.gameResult = "0-1";
										stopClocks();
									}
								} else {
									if ($scope.blackTime > 0) {
										$scope.blackTime -= 1;
										$scope.blackClock = generateClockTimeFromSeconds($scope.blackTime);
									} else {

										$scope.playingGame = false;
										$scope.gameResult = "1-0";
										stopClocks();
									}
								}
								clockTimer = $timeout(function() {
									$scope.onTimeout(whitePlayer)
								}, 1000);

							}

							var startClock = function(whitePlayer) {
								// console.log("Starting clock for
								// whitePlayer:"+ whitePlayer);
								clockTimer = $timeout($scope
										.onTimeout(whitePlayer), 1000);

							}

							$scope.pressClock = function(whitePlayer) {
								// console.log("Pressing clock");
								$timeout.cancel(clockTimer);
								startClock(whitePlayer);
							}

							var stopClocks = function() {
								// console.log("Stopping clock");
								$timeout.cancel(clockTimer);

							}

							var startGame = function(data) {
								$(".chessPiece").show();
								moveNumber = 0;
								$scope.playingGame = true;
								$scope.gameResult = "";
								$scope.whiteTime = data.time * 60;
								$scope.blackTime = data.time * 60;
								$scope.drawOfferReceived = false;
								$scope.whitePlayerElo = data.whitePlayerElo;
								$scope.blackPlayerElo = data.blackPlayerElo;
								$scope.whitePlayerName = data.whitePlayer;
								$scope.blackPlayerName = data.blackPlayer;
								$scope.whiteClock = generateClockTimeFromSeconds($scope.whiteTime);
								$scope.blackClock = generateClockTimeFromSeconds($scope.blackTime);
								// console.log("Starting game.");
								// console.log(data.blackPlayer, user.username);

								$scope.$apply(function() {

									// console.log("nulling annotated moves");
									$scope.annotatedMoves = [];
									// console.log("Setting newGame to true;");

									initPage();
									$scope.newGame = true;
								});

								if (data.blackPlayer == user.username) {

									// console.log("I am the black player.")
									$scope.$apply(function() {
										$scope.oponent = data.whitePlayer;
										$scope.whitePlayer = false;
										// initialiseWebSockets();
									});

								} else {

									$scope.$apply(function() {
										$scope.oponent = data.blackPlayer;
										$scope.whitePlayer = true;
										$scope.myMove = true;

									});
								}
								// console.log("My oponent is:" +
								// $scope.oponent);
								startClock(true);

							};
							
							$scope.displayPromotionPicker =function(elem, startPos, endPos){
								startPosition=startPos;
								endPosition=endPos;
								element = elem;
								$scope.promotionSquareReached=true;
								
							}
							
							$scope.promotePiece= function(piece){
								console.log("piece promoted:"+piece);
								var src= element.context.src;
								
								$(element).attr('src','http://localhost:8082/images/pieces/BQ.png');
								$scope.updateChessboardAfterMove(element,startPosition,endPosition,true,$scope.whitePlayer, piece);
								$scope.lastMove.startPosition=startPosition;
								$scope.lastMove.endPosition=endPosition;
							//	console.log(startPosition);
//								console.log(endPosition);
//								console.log(getInitialPositionOfPiece(startPosition.piece).row);
//								console.log(getInitialPositionOfPiece(startPosition.piece).column);
								$scope.pressClock(!$scope.whitePlayer);
								$scope.setMyMove(false);
							}

							$scope.endGame = function(gameResult) {
								var gameResultWhite;
								var gameResultBlack;
								if (gameResult === "1-0") {
									gameResultWhite = 1;
									gameResultBlack = 0;
								} else if (gameResult === "0-1") {
									gameResultWhite = 0;
									gameResultBlack = 1;
								} else if (gameResult === "1/2 - 1/2") {
									gameResultWhite = 0.5;
									gameResultBlack = 0.5;
								}
								stopClocks();
								$scope.playingGame = false;
								var newElos = calculateEloChange(
										$scope.whitePlayerElo,
										$scope.blackPlayerElo, gameResultWhite,
										gameResultBlack);
								$scope.gameResult = gameResult;

								return newElos;

							}

							$scope.offerDraw = function() {
								var drawOffer = {
									action : "offerDraw",
									oponent : $scope.oponent
								}
								// console.log("sending draw offer to server");
								socket.send(JSON.stringify(drawOffer));
							};

							$scope.drawOfferReply = function(acceptDraw) {
								var drawOffer = {
									action : "drawOfferReply",
									player : user.username,
									oponent : $scope.oponent,
									acceptDraw : acceptDraw
								}
								// console.log("sending drawOfferReply to
								// server");

								if (acceptDraw) {
									var newElos = $scope.endGame("1/2 - 1/2");
									var myNewElo = $scope.whitePlayer ? newElos.newRatingWhite
											: newElos.newRatingBlack;
									var oponentsNewElo = !$scope.whitePlayer ? newElos.newRatingWhite
											: newElos.newRatingBlack;
									$scope.whitePlayerElo = $scope.whitePlayer ? myNewElo
											: oponentsNewElo;
									$scope.blackPlayerElo = !$scope.whitePlayer ? myNewElo
											: oponentsNewElo;
									drawOffer.myNewElo = myNewElo;
									drawOffer.oponentsNewElo = oponentsNewElo;
									// stopClocks();
									$scope.playingGame = false;
									// $scope.gameResult = $scope.gameResult =
									// "1/2 - 1/2";
								}
								// console.log(drawOffer);
								socket.send(JSON.stringify(drawOffer));
							}

							$scope.resign = function() {
								var newElos = $scope
										.endGame(!$scope.whitePlayer ? "1-0"
												: "0-1");
								var myNewElo = $scope.whitePlayer ? newElos.newRatingWhite
										: newElos.newRatingBlack;
								var oponentsNewElo = !$scope.whitePlayer ? newElos.newRatingWhite
										: newElos.newRatingBlack;
								var resignation = {
									action : "resign",
									player : user.username,
									oponent : $scope.oponent,
									myNewElo : myNewElo,
									oponentsNewElo : oponentsNewElo
								};

								$scope.whitePlayerElo = $scope.whitePlayer ? myNewElo
										: oponentsNewElo;
								$scope.blackPlayerElo = !$scope.whitePlayer ? myNewElo
										: oponentsNewElo;
								// $scope.newGame=false;

								socket.send(JSON.stringify(resignation));

								// stopClocks();
								//								
								$scope.playingGame = false;
								// $scope.gameResult =
								// !$scope.whitePlayer?"1-0":"0-1";

							}

							$scope.seekOponent = function() {
								// console.log("Sending seek to server.");
								var seekDetails = {

									action : "seekOponent",
									user : LoginService.getUserLoggedIn().username,
									time : parseInt($scope.time),
									increment : parseInt($scope.increment)

								}
								// console.log(seekDetails.time,seekDetails.increment)
								socket.send(JSON.stringify(seekDetails));
							};

							var sendMove = function(element, startPosition,
									endPosition, kingInCheck) {

								var moveAction = {
									action : "move",
									element : element,
									oponent : $scope.oponent,
									startPosition : startPosition,
									endPosition : endPosition,
									kingInCheck : kingInCheck

								};
								// console.log(socket);
								socket.send(JSON.stringify(moveAction));
								// console.log("sending move");
								// console.log(moveAction);
							}

							$scope.$watch("newGame", function(value) {
								console.log("newGame changed:" + value);
								if (value == true) {
									// initPage();
								}
							});

							// $scope.$watch("whitePlayer", function(value) {
							// //console.log("hello from watch.:" + value);
							// // I change here
							// var val = value || null;
							// if (val) {
							// // initPage();
							// }
							// });

							var initPage = function() {
								$timeout(function() {
									chessboard = {};
									// console.log("Getting element.");
									chessboard.element = document
											.getElementsByName("chessboardTable")[0];
									// console.log(chessboard.element);
									chessboard.pieces = [];
									chessboard.annotatedMoves = [];
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

								// //console.log("initialising controller");

								$timeout(function() {
									$scope.$apply(function() {
										initPage();
										// //console.log("Setting whitePlayer");
										$scope.whitePlayer = true;

									});
								});

							};

							init();
						} ]);