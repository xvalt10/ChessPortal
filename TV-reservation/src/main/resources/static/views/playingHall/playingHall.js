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
							$scope.castling = null;
							$scope.lastMove = {};

							$scope.squareSize = squareSize;
							$scope.playingGame = null;
							$scope.oponent = null;
							$scope.whitePlayer = null;
							$scope.time = 0;
							$scope.increment = 0;
							$scope.whiteMove = true;
							$scope.whiteClock = "00:00";
							$scope.blackClock = "00:00";
							$scope.myMove = null;
							$scope.whitePlayerName = "whitePlayer";
							$scope.whitePlayerElo = 1500;
							$scope.blackPlayerName = "blackPlayer";
							$scope.blackPlayerElo = 1500;
							$scope.gameResult = null;
							$scope.promotionSquareReached = false;
							$scope.seekFormShown = false;

							$scope.initialisationComplete = function() {
								$scope.$apply(function() {
									// //console.log("Setting newGame to
									// false;");
									$scope.newGame = false;
								});

							};

							$scope.setMyMove = function(isItMyMove) {
								$scope.myMove = isItMyMove;
							}

							function isWhiteOnMove() {
								console.log("Move number:" + moveNumber);
								return moveNumber % 2 == 0;
							}

							var getChessboardCoordinates = function(obj) {
								var top;
								top = 0;
								if (obj.offsetParent) {
									do {

										top += obj.offsetTop;
									} while (obj = obj.offsetParent);
								}
								// //console.log(chessboard);
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
								// //console.log("Square size:" + squareSize);
								// //console.log(chessboard.coordinates);
							};

							$scope.determineRowColumn = function(x, y,
									whitePlayer) {
								// //console.log(squareSize);
								// //console.log(chessboard.coordinates)

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

							$scope.getInitialPositionOfPiece = function(piece) {
								// console.log(piece);
								var coordinates = {};
								for (var index = 0; index < chessboard.pieces.length; index++) {
									if (chessboard.pieces[index].piece === piece) {
										coordinates.row = chessboard.pieces[index].row;
										coordinates.column = chessboard.pieces[index].column;
										coordinates.piece = piece;
										// console.log("Piece found.");
										return coordinates;
									}

								}

							};

							function isRookMoveLegal(startPosition, endPosition) {
								var isLegal = true;
								if (endPosition.row == startPosition.row) {
									for (var x = 1; x < Math
											.abs(endPosition.column
													- startPosition.column); x++) {
										if (chessboard.squares[findIndexOfSquare(
												endPosition.column > startPosition.column ? startPosition.column
														+ x
														: startPosition.column
																- x,
												startPosition.row)].piece !== "empty") {
											isLegal = false;
										}
									}

								} else if (endPosition.column == startPosition.column) {
									for (var x = 1; x < Math
											.abs(endPosition.row
													- startPosition.row); x++) {
										if (chessboard.squares[findIndexOfSquare(
												startPosition.column,
												endPosition.row > startPosition.row ? startPosition.row
														+ x
														: startPosition.row - x)].piece !== "empty") {
											isLegal = false;
										}
									}
								} else {
									isLegal = false;
								}
								// console.log("Rook move legal:" + isLegal);
								return isLegal;
							}
							;

							function isPawnMoveLegal(startPosition,
									endPosition, whitePlayer) {
								if (Math.abs(startPosition.row
										- endPosition.row) > 2
										|| Math.abs(startPosition.column
												- endPosition.column) > 1) {
									return false;
								} 
								else if(($scope.whiteMove==true && endPosition.row<startPosition.row)||($scope.whiteMove==false && endPosition.row>startPosition.row)){
									return false;
								}
								
								else if (Math
										.abs(!whitePlayer ? startPosition.row
												- endPosition.row
												: endPosition.row
														- startPosition.row) == 1
										&& Math.abs(startPosition.column
												- endPosition.column) == 1
										&& (endPosition.piece != "empty")) {
									return true;
								} else if (Math
										.abs(!whitePlayer ? startPosition.row
												- endPosition.row
												: endPosition.row
														- startPosition.row) == 1
										&& startPosition.column
												- endPosition.column == 0&& (endPosition.piece == "empty")) {
									return true;
								} else if (Math
										.abs(!whitePlayer ? startPosition.row
												- endPosition.row
												: endPosition.row
														- startPosition.row) == 2
										&& startPosition.column
												- endPosition.column == 0) {
									var initialPositionOfPiece = $scope
											.getInitialPositionOfPiece(startPosition.piece);
									if (startPosition.row == initialPositionOfPiece.row
											&& startPosition.column == initialPositionOfPiece.column) {
										return true;
									} else {
										return false;
									}
								} else if (!whitePlayer ? startPosition.row
										- endPosition.row : endPosition.row
										- startPosition.row == 1
										&& Math.abs(endPosition.column
												- startPosition.column) == 1) {
									return pieceTakenEnPassant(startPosition,
											endPosition, whitePlayer,
											$scope.lastMove);

								}
							}

							function pieceTakenEnPassant(startPosition,
									endPosition, whitePlayer, lastMove) {
								// console.log("En passant function called.");
								console
										.log(startPosition.piece.indexOf("P") != -1);
								var squaresMovedForward;
								if ($scope.myMove == true) {
									squaresMovedForward = !whitePlayer ? startPosition.row
											- endPosition.row
											: endPosition.row
													- startPosition.row;
								} else {
									squaresMovedForward = Math
											.abs(startPosition.row
													- endPosition.row);
								}
								// console.log(squaresMovedForward,
								// $scope.myMove);
								// console.log(Math.abs(endPosition.column
								// - startPosition.column) == 1);
								if (startPosition.piece.indexOf("P") != -1
										&& squaresMovedForward == 1
										&& Math.abs(endPosition.column
												- startPosition.column) == 1) {
									// console.log(lastMove);
									if ($scope.lastMove.startPosition.piece
											.indexOf("P") != -1
											&& Math
													.abs($scope.lastMove.startPosition.row
															- $scope.lastMove.endPosition.row) == 2
											&& $scope.lastMove.endPosition.column == endPosition.column) {
										// console.log("En passant.");
										enPassant = true;
										return true;
									} else
										false;

								}
							}

							function canRookMateBePrevented(chessboard,
									kingPosition, checkingPiecePosition,
									whiteMove) {
								var matePreventionPossible = false;
								if (kingPosition.row == checkingPiecePosition.row) {
									for (var x = 1; x < Math
											.abs(kingPosition.column
													- checkingPiecePosition.column); x++) {

										if (canAnyOponentsPieceMoveToSquare(
												chessboard,
												kingPosition.row,
												kingPosition.column > checkingPiecePosition.column ? checkingPiecePosition.column
														+ x
														: checkingPiecePosition.column
																- x, whiteMove) == true) {

											matePreventionPossible = true;
											break;
										}

									}

								} else if (kingPosition.column == checkingPiecePosition.column) {
									for (var x = 1; x < Math
											.abs(kingPosition.row
													- checkingPiecePosition.row); x++) {

										if (canAnyOponentsPieceMoveToSquare(
												chessboard,
												kingPosition.row > checkingPiecePosition.row ? checkingPiecePosition.row
														+ x
														: checkingPiecePosition.row
																- x,
												kingPosition.column, whiteMove) == true) {

											matePreventionPossible = true;
											break;
										}

									}
								}
								return matePreventionPossible;

							}
							function canBishopMateBePrevented(chessboard,
									kingPosition, checkingPiecePosition,
									whiteMove) {
								console.log("Can bishop mate be prevented?");
								var matePreventionPossible = false;
								if (kingPosition.row > checkingPiecePosition.row
										&& kingPosition.column > checkingPiecePosition.column) {
									for (var x = 1; x < kingPosition.row
											- checkingPiecePosition.row; x++) {
										if (canAnyOponentsPieceMoveToSquare(
												chessboard,
												checkingPiecePosition.row + x,
												checkingPiecePosition.column
														+ x, whiteMove) == true) {
											console.log("Yes - option 1");
											matePreventionPossible = true;
											break;
										}

									}

								} else if (kingPosition.row > checkingPiecePosition.row
										&& kingPosition.column < checkingPiecePosition.column) {
									for (var x = 1; x < endPosition.row
											- checkingPiecePosition.row; x++) {
										if (canAnyOponentsPieceMoveToSquare(
												chessboard, kingPosition.row
														- x,
												kingPosition.column + x,
												whiteMove) == true) {
											console.log("Yes - option 2");
											matePreventionPossible = true;
											break;
										}

									}

								} else if (kingPosition.row < checkingPiecePosition.row
										&& kingPosition.column > checkingPiecePosition.column) {
									for (var x = 1; x < startPosition.row
											- endPosition.row; x++) {
										if (canAnyOponentsPieceMoveToSquare(
												chessboard, kingPosition.row
														+ x,
												kingPosition.column - x,
												whiteMove) == true) {
											console.log("Yes - option 3");
											matePreventionPossible = true;
											break;
										}

									}

								} else if (kingPosition.row < checkingPiecePosition.row
										&& kingPosition.column < checkingPiecePosition.column) {
									for (var x = 1; x < checkingPiecePosition.row
											- endPosition.row; x++) {
										if (canAnyOponentsPieceMoveToSquare(
												chessboard, kingPosition.row
														+ x,
												kingPosition.column + x,
												whiteMove) == true) {
											console.log("Yes - option 4");
											matePreventionPossible = true;
											break;
										}

									}

								}
								return matePreventionPossible;
							}

							function canMateBePrevented(chessboard,
									kingPosition, checkingPiecePosition,
									whiteMove) {
								var matePreventionPossible = false;
								
								if (canAnyOponentsPieceMoveToSquare(
										chessboard,
										checkingPiecePosition.row,
										checkingPiecePosition.column,
										whiteMove,true)) {

									matePreventionPossible = true;
								}
								else {

								switch (checkingPiecePosition.piece
										.substr(1, 1)) {
							/*	case "P":
									if (canAnyOponentsPieceMoveToSquare(
											chessboard,
											checkingPiecePosition.row,
											checkingPiecePosition.column,
											whiteMove)) {

										matePreventionPossible = true;
									}
									break;

								case "N":
									if (canAnyOponentsPieceMoveToSquare(
											chessboard,
											checkingPiecePosition.row,
											checkingPiecePosition.column,
											whiteMove)) {

										matePreventionPossible = true;
									}
									break;*/

								case "B":
									matePreventionPossible = canBishopMateBePrevented(
											chessboard, kingPosition,
											checkingPiecePosition, whiteMove);
									break;

								case "R":
									matePreventionPossible = canRookMateBePrevented(
											chessboard, kingPosition,
											checkingPiecePosition, whiteMove);
									break;

								case "Q":
									if (canBishopMateBePrevented(chessboard,
											kingPosition,
											checkingPiecePosition, whiteMove) == true
											|| canRookMateBePrevented(
													chessboard, kingPosition,
													checkingPiecePosition,
													whiteMove) == true) {
										matePreventionPossible = true;
									}
									break;

								}}
								return matePreventionPossible;
							}
							function isKingMoveLegal(startPosition,
									endPosition, whitePlayer,stopRecursion) {
								if (Math.abs(endPosition.row
										- startPosition.row) <= 1
										&& Math.abs(endPosition.column
												- startPosition.column) <= 1
										&& (whitePlayer==true ? isBlackPieceOnSquare(endPosition.row, endPosition.column)||isSquareEmpty(endPosition.row, endPosition.column)
												: isWhitePieceOnSquare(endPosition.row, endPosition.column)||isSquareEmpty(endPosition.row, endPosition.column))) {
									
									if(stopRecursion==true & canAnyOponentsPieceMoveToSquare(chessboard, endPosition.row, endPosition.column, $scope.whiteMove)==false){
									console.log("King capture allowed. NO check.");
									return true;}
									else if(stopRecursion!=true){
										console.log("Normal king move.");
										return true;
									}
								} else if (endPosition.row == startPosition.row
										&& Math.abs(endPosition.column
												- startPosition.column) == 2
										&& endPosition.column == 6) {
									if (whitePlayer == true
											&& isSquareEmpty(0, 5)
											&& !canAnyOponentsPieceMoveToSquare(
													chessboard, 0, 5,
													$scope.whiteMove)
											&& isSquareEmpty(0, 6)
											&& !canAnyOponentsPieceMoveToSquare(
													chessboard, 0, 6,
													$scope.whiteMove) && hasKingAlreadyMoved("white")==false) {
										console.log("White Short castle");
										$scope.castling = "0-0";
										return true;
									}

									if (whitePlayer == false
											&& endPosition.column == 6
											&& isSquareEmpty(7, 5)
											&& !canAnyOponentsPieceMoveToSquare(
													chessboard, 7, 5,
													$scope.whiteMove)
											&& isSquareEmpty(7, 6)
											&& !canAnyOponentsPieceMoveToSquare(
													chessboard, 7, 6,
													$scope.whiteMove)&& hasKingAlreadyMoved("black")==false) {
										console.log("Black Short castle");
										$scope.castling = "0-0";
										return true;
									}

									/*
									 * if (whitePlayer==true ?
									 * endPosition.column == 6 :
									 * endPosition.column == 1 &&
									 * whitePlayer==true ? isSquareEmpty( 0, 5) &&
									 * !canAnyOponentsPieceMoveToSquare(
									 * chessboard, 0, 5, $scope.whiteMove) &&
									 * isSquareEmpty(0, 6) &&
									 * !canAnyOponentsPieceMoveToSquare(
									 * chessboard, 0, 6, $scope.whiteMove) :
									 * isSquareEmpty(7, 5) &&
									 * !canAnyOponentsPieceMoveToSquare(
									 * chessboard, 7, 5, $scope.whiteMove) &&
									 * isSquareEmpty(7, 6) &&
									 * !canAnyOponentsPieceMoveToSquare(
									 * chessboard, 7, 6, $scope.whiteMove)) {
									 * console.log("Short castle");
									 * $scope.castling="0-0"; return true; }
									 */

								} else if (endPosition.row == startPosition.row
										&& Math.abs(endPosition.column
												- startPosition.column) == 2
										&& (endPosition.column == 2)) {
									if (whitePlayer == true
											&& isSquareEmpty(0, 2) &&stopRecursion!=true
											&& !canAnyOponentsPieceMoveToSquare(
													chessboard, 0, 2,
													$scope.whiteMove,true)
											&& isSquareEmpty(0, 3)
											&& !canAnyOponentsPieceMoveToSquare(
													chessboard, 0, 3,
													$scope.whiteMove,true)&& hasKingAlreadyMoved("white")==false) {
										console.log("White Long castle");
										$scope.castling = "0-0-0";
										return true;
									}

									if (whitePlayer == false
											&& isSquareEmpty(7, 2) &&stopRecursion!=true
											&& !canAnyOponentsPieceMoveToSquare(
													chessboard, 7, 2,
													$scope.whiteMove,true)
											&& isSquareEmpty(7, 3)
											&& !canAnyOponentsPieceMoveToSquare(
													chessboard, 7, 3,
													$scope.whiteMove,true)&& hasKingAlreadyMoved("black")==false) {
										
										console.log("Black Long castle");
										$scope.castling = "0-0-0";
										return true;
									}
									// if (whitePlayer ? endPosition.column == 2
									// : endPosition.column == 5
									// && whitePlayer ? isSquareEmpty(
									// 0, 2)
									// && !canAnyOponentsPieceMoveToSquare(
									// chessboard, 0, 2,
									// $scope.whiteMove)
									// && isSquareEmpty(0, 3)
									// && !canAnyOponentsPieceMoveToSquare(
									// chessboard, 0, 3,
									// $scope.whiteMove)
									//													
									// : isSquareEmpty(7, 2)
									// && !canAnyOponentsPieceMoveToSquare(
									// chessboard,
									// 7,
									// 2,
									// $scope.whiteMove)
									// && isSquareEmpty(7,
									// 3)
									// && !canAnyOponentsPieceMoveToSquare(
									// chessboard,
									// 7,
									// 3,
									// $scope.whiteMove)) {
									// console.log("Long castle");
									// $scope.castling="0-0-0";
									// return true;
									// }
								} else {
									console.log("King else condition.");
									console.log(startPosition);
console.log(endPosition);
console.log(whitePlayer);
									return false;
								}
							}

							function isBishopMoveLegal(startPosition,
									endPosition, whitePlayer) {
								var isLegal = true;
								if (Math.abs(endPosition.row
										- startPosition.row) == Math
										.abs(endPosition.column
												- startPosition.column)
								// && (whitePlayer ?
								// endPosition.piece.indexOf("W") == -1:
								// endPosition.piece.indexOf("B") == -1)
								) {
									if (endPosition.row > startPosition.row
											&& endPosition.column > startPosition.column) {
										for (var x = 1; x < endPosition.row
												- startPosition.row; x++) {
											if (chessboard.squares[findIndexOfSquare(
													startPosition.column + x,
													startPosition.row + x)].piece !== "empty") {
												// console.log("Case1");
												isLegal = false;
												break;
											}
											;

										}

									} else if (endPosition.row > startPosition.row
											&& endPosition.column < startPosition.column) {
										for (var x = 1; x < endPosition.row
												- startPosition.row; x++) {
											if (chessboard.squares[findIndexOfSquare(
													endPosition.column + x,
													endPosition.row - x)].piece !== "empty") {
												// console.log("Case2");
												console
														.log(chessboard.squares[findIndexOfSquare(
																endPosition.column
																		+ x,
																startPosition.row
																		+ x)].piece);

												isLegal = false;
												break;
											}
											;

										}

									} else if (endPosition.row < startPosition.row
											&& endPosition.column > startPosition.column) {
										for (var x = 1; x < startPosition.row
												- endPosition.row; x++) {
											if (chessboard.squares[findIndexOfSquare(
													endPosition.column - x,
													endPosition.row + x)].piece !== "empty") {
												// console.log("Case3");
												isLegal = false;
												break;
											}
											;

										}

									} else if (endPosition.row < startPosition.row
											&& endPosition.column < startPosition.column) {
										for (var x = 1; x < startPosition.row
												- endPosition.row; x++) {
											if (chessboard.squares[findIndexOfSquare(
													endPosition.column + x,
													endPosition.row + x)].piece !== "empty") {
												// console.log("Case4");
												isLegal = false;
												break;
											}
											;

										}

									}

								} else {
									// console.log("Case 5");
									isLegal = false;
								}
								// console.log("Bishop move legal:" + isLegal);
								return isLegal;
							}
							;

							$scope.checkLegalityOfMove = function(
									startPosition, endPosition, whitePlayer,stopRecursion) {
								/*console.log("Checking legality of move:")
								console.log(startPosition);
								console.log(endPosition);
								console.log(whitePlayer);*/

								if (typeof endPosition == 'undefined') {
									return false;
								}

								if (startPosition.piece == "empty") {
									return false;
								}

								if (endPosition.row == startPosition.row
										&& endPosition.column == startPosition.column) {
									return false;
								}

								// //console.log("Checking legality of piece:"
								// + startPosition.piece.substr(1, 1)
								// + " " + topPiece);
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
													: (endPosition.piece
															.indexOf("B") == -1 || endPosition.piece
															.indexOf("WB") != -1))) {
										// console.log("Legal knight move");
										return true;
									} else {

										// console.log();
										// console.log("Illegal knight move");
										return false;
									}
									break;

								case "P":
									return isPawnMoveLegal(startPosition,
											endPosition, whitePlayer);
									break;
								case "K":
									console.log("calling isKingMoveLegalFunction:"+stopRecursion);
									return isKingMoveLegal(startPosition,
											endPosition, whitePlayer,stopRecursion);
									break;
								case "B":
									return isBishopMoveLegal(startPosition,
											endPosition, whitePlayer);
									break;
								case "R":
									return isRookMoveLegal(startPosition,
											endPosition);
									break;
								case "Q":
									return isBishopMoveLegal(startPosition,
											endPosition)
											|| isRookMoveLegal(startPosition,
													endPosition);
									break;
								default:
									return true;
								}

							};

							function isSquareEmpty(row, column) {
								return chessboard.squares[findIndexOfSquare(
										column, row)].piece == "empty";
							}

							function isBlackPieceOnSquare(row, column) {
								if (chessboard.squares[findIndexOfSquare(
										column, row)].piece.indexOf("W") == -1) {
									return true;
								} else
									return false;
							}

							function isWhitePieceOnSquare(row, column) {
								if (chessboard.squares[findIndexOfSquare(
										column, row)].piece.indexOf("W") != -1) {
									return true;
								} else
									return false;
							}

							function canAnyOponentsPieceMoveToSquare(
									chessboard, row, column, whiteMove,stopRecursion) {
								var pieceFound = false;
								var targetSquareIndex = findIndexOfSquare(
										column, row);
								var targetSquare = chessboard.squares[targetSquareIndex];
								console
										.log("Can any oponent's piece move to suqare:");
								console.log(targetSquare);
								console.log("Colour:"+whiteMove);
								chessboard.squares
										.forEach(function(initialSquare) {

											if (initialSquare.piece
													.indexOf("empty") == -1) {
												if ((whiteMove == true && isBlackPieceOnSquare(
														initialSquare.row,
														initialSquare.column))
														|| (whiteMove == false && isWhitePieceOnSquare(
																initialSquare.row,
																initialSquare.column))) {

													
													if ($scope
															.checkLegalityOfMove(
																	initialSquare,
																	targetSquare,
																	$scope.whitePlayer,stopRecursion) == true) {

														console
																.log("Following piece can move to targetSqare:"
																		+ initialSquare.piece
																		+ ".");
														pieceFound = true;
													}
												}
											}

										});
								return pieceFound;

							}

							function isKingMated(chessboard, kingPosition,
									checkingPiecePosition, whiteMove) {

								var x = [ 1, 1, 1, -1, -1, -1, 0, 0 ];
								var y = [ 0, 1, -1, 0, 1, -1, 1, -1 ];
								var numberOfLegalSquareForKingMove = 8;

								for (var i = 0; i < x.length; i++) {

									var targetSquareIndex = findIndexOfSquare(
											kingPosition.column + x[i],
											kingPosition.row + y[i]);
									var targetSquare = chessboard.squares[targetSquareIndex];
									// console.log(kingPosition);
									// console.log(targetSquare);
									if ($scope.checkLegalityOfMove(
											kingPosition, targetSquare,
											!$scope.whiteMove) == false) {
										console.log("Retracting square:"
												+ (kingPosition.column + x[i])
												+ " "
												+ (kingPosition.row + y[i]));
										numberOfLegalSquareForKingMove--;
									} else if (canAnyOponentsPieceMoveToSquare(
											chessboard,
											kingPosition.row + y[i],
											kingPosition.column + x[i],
											!$scope.whiteMove) == true) {
										console.log("Retracting square:"
												+ (kingPosition.column + x[i])
												+ " "
												+ (kingPosition.row + y[i]));
										numberOfLegalSquareForKingMove--;
									} else {
										console
												.log("Valid square for king move:"
														+ (kingPosition.column + x[i])
														+ " "
														+ (kingPosition.row + y[i]));
									}

								}
								if (numberOfLegalSquareForKingMove > 0 ) {
									// console.log("King not mated:"
									// + numberOfLegalSquareForKingMove);
									return false;
								} else {
									console.log("King has no squares.");
									if (canMateBePrevented(chessboard,
											kingPosition,
											checkingPiecePosition, $scope.whiteMove) == true) {
										console.log("Mate can be prevented.");
										return false;
									}
									// console.log("King is mated.");
									else{
									return true;}
								}
							}

							function isKingInCheckOrAndMate(chessboard,
									whiteMove, startPosition, endPosition) {
								endPosition.piece = startPosition.piece;
								var kingPosition = {};
								var kingInCheckOrAndMate = {};
								kingInCheckOrAndMate.check = false;
								kingInCheckOrAndMate.mate = false;

								chessboard.squares
										.forEach(function(square) {
											if (endPosition.piece.indexOf("W") != -1 ? square.piece
													.indexOf("BK") != -1
													: square.piece
															.indexOf("WK") != -1) {
												kingPosition.row = square.row;
												kingPosition.column = square.column;
												kingPosition.piece = square.piece;
											}

										});
								 console.log("Is king in check check");
								// console.log(endPosition);
								 console.log(kingPosition);
								 if ($scope.checkLegalityOfMove(
											endPosition,
											kingPosition,
											$scope.whiteMove) == true) {
										console.log("Checking piece "+endPosition.piece);
										kingInCheckOrAndMate.check = true;
										kingInCheckOrAndMate.mate = isKingMated(
												chessboard,
												kingPosition,
												endPosition,
												whiteMove)
									
									 
								 }
								 else{

								chessboard.squares
										.forEach(function(square) {
											if ($scope.whiteMove==false ? isBlackPieceOnSquare(square.row, square.column)
													: isWhitePieceOnSquare(square.row, square.column)) {
												if ($scope.checkLegalityOfMove(
														square,
														kingPosition,
														$scope.whiteMove) == true) {
													console.log("Checking piece "+square.piece);
													kingInCheckOrAndMate.check = true;
													kingInCheckOrAndMate.mate = isKingMated(
															chessboard,
															kingPosition,
															endPosition,
															whiteMove)
												}
											}
											;

										});}
								return kingInCheckOrAndMate;

								//								
								// chessboard.pieces.forEach(function(piece){
								//									
								// if($scope.whitePlayer &&
								// piece.piece.indexOf("W")!=-1 &&
								// $scope.checkLegalityOfMove(piece,kingPosition,
								// $scope.whitePlayer)==true){
								// //console.log("Black king in check.");
								// //console.log(piece);
								// kingInCheck=true;
								//										
								// }
								// else if (!$scope.whitePlayer &&
								// piece.piece.indexOf("B")!=-1 &&
								// $scope.checkLegalityOfMove(piece,kingPosition,
								// $scope.whitePlayer)==true){
								//										
								// //console.log("White king in check.");
								// //console.log(piece);
								// kingInCheck = true;
								//										
								// }
								// });
								// return kingInCheck;
							}
							;
							
							$scope.redrawChessboard=function(currentSquares){
								if($scope.playingGame==false){
								for (var int = 0; int < currentSquares.length; int++) {
									if(currentSquares[int].piece!="empty"){
										console.log("Moving "+currentSquares[int].piece +"to row:"+currentSquares[int].row+" column:"+currentSquares[int].column);
										$scope.movePieceToCoordinates(currentSquares[int].piece,currentSquares[int].row, currentSquares[int].column);
										
									} 
								}}
							}

							$scope.drawLastMove = function(startPosition,
									endPosition) {
								console.log("Drawing move");
								console.log(startPosition, endPosition);
								var startPositionSquareColor;
								var endPositionSquareColor;
								if ((startPosition.row % 2 == 0 && startPosition.column % 2 == 0)
										|| (startPosition.row % 2 != 0 && startPosition.column % 2 != 0)) {
									startPositionSquareColor = 'BS';
								} else {
									startPositionSquareColor = 'WS';
								}
								if ((endPosition.row % 2 == 0 && endPosition.column % 2 == 0)
										|| (endPosition.row % 2 != 0 && endPosition.column % 2 != 0)) {
									endPositionSquareColor = 'BS';
								} else {
									endPositionSquareColor = 'WS';
								}
								var startElement = $scope.whitePlayer ? "W"
										+ startPositionSquareColor
										+ startPosition.column
										+ startPosition.row : "B"
										+ startPositionSquareColor
										+ startPosition.column
										+ startPosition.row;
								var endElement = $scope.whitePlayer ? "W"
										+ endPositionSquareColor
										+ endPosition.column + endPosition.row
										: "B" + endPositionSquareColor
												+ endPosition.column
												+ endPosition.row;
								// console.log(startElement, endElement);
								createLine(
										$("#" + startElement).offset().left + 27,
										$("#" + startElement).offset().top + 27,
										$("#" + endElement).offset().left + 27,
										$("#" + endElement).offset().top + 27);
								/*
								 * createLine($("#"+endElement).offset().left+27,$("#"+endElement).offset().top+27+25,$("#"+endElement).offset().left+34.5,$("#"+endElement).offset().top+40.25+25);
								 * createLine($("#"+endElement).offset().left+27,$("#"+endElement).offset().top+27+25,$("#"+endElement).offset().left+19.5,$("#"+endElement).offset().top+40.25+25);
								 */
								// / //console.log(startElement,endElement);
								// jsPlumb.ready(function() {
								// var common = {
								// connector: ["Straight"],
								// anchor: ["Center", "Center"],
								// // endpoint:"Dot"
								// };
								//						        
								// jsPlumb.detachEveryConnection();
								// jsPlumb.deleteEveryEndpoint();
								//
								// jsPlumb.connect({
								// source:startElement,
								// target:endElement,
								// paintStyle:{ strokeStyle:"lightblue",
								// lineWidth:8 },
								// endpoint:[ "Dot", { radius:1,
								// hoverClass:"myEndpointHover" }, common ],
								// endpointStyle:{ fillStyle:"lightblue",
								// outlineColor:"gray" },
								// overlays:[
								// ["Arrow" , { width:25, length:12, location:1
								// }]
								// ]
								// }, common);
								// });
								//							    
							}

							function createLineElement(x, y, length, angle) {
								var line = document.createElement("div");
								var styles = 'border: 3px solid lightblue; '
										+ 'width: '
										+ length
										+ 'px; '
										+ 'height: 0px; '
										+ '-moz-transform: rotate('
										+ angle
										+ 'rad); '
										+ '-webkit-transform: rotate('
										+ angle
										+ 'rad); '
										+ '-o-transform: rotate('
										+ angle
										+ 'rad); '
										+ '-ms-transform: rotate('
										+ angle
										+ 'rad); '
										+ 'position: absolute; '
										+ 'top: '
										+ y
										+ 'px; '
										+ 'left: '
										+ x
										+ 'px; ';
								line.setAttribute('style', styles);
								line.setAttribute('id', 'arrow');
								return line;
							}

							function createLine(x1, y1, x2, y2) {
								$("#arrow").remove();
								// console.log(x1, y1, x2, y2);
								var a = x1 - x2, b = y1 - y2, c = Math.sqrt(a
										* a + b * b);

								var sx = (x1 + x2) / 2, sy = (y1 + y2) / 2;

								var x = sx - c / 2, y = sy;

								var alpha = Math.PI - Math.atan2(-b, a);
								document.body.appendChild(createLineElement(x,
										y, c, alpha));

							}
							
							$scope.movePieceToCoordinates = function(piece,row,column){
//								var squareoffset = $("img[id*='S"+column+row+"']").offset();
//								var pieceoffset = $("#WR00").offset();
//								
//								console.log("img[id*='S"+column+row+"']");
//							 	console.log($("img[id*='S"+column+row+"']").offset());
//							 	console.log($("#WR00").offset());
//							 	console.log(((pieceoffset.top-squareoffset.top )*-1)+ (0.26 * squareSize));
//							 	console.log((pieceoffset.left -squareoffset.left));
//							 	$("#WR00").css({
//
//									top : (((pieceoffset.top-squareoffset.top )*-1)+ (0.26 * squareSize))
//											+ 'px',
//									left : (pieceoffset.left -squareoffset.left)
//											+ 'px',
//
//								});
								var top = (((($scope
										.getInitialPositionOfPiece(piece).row) - row) * squareSize) + (0.13 * squareSize));
								var left = (((column - ($scope
										.getInitialPositionOfPiece(piece)).column) * squareSize) + (0.13 * squareSize));

								$("#"+piece).css({

									top : $scope.whitePlayer ? top + 'px' : (top
											* (-1) + (0.26 * squareSize))
											+ 'px',
									left : $scope.whitePlayer ? left + 'px' : (left
											* (-1) + (0.26 * squareSize))
											+ 'px',

								});
								
							}

							function movePieceOnBoard(element, startPosition,
									endPosition, whitePlayer) {
								var top = (((($scope
										.getInitialPositionOfPiece(startPosition.piece).row) - endPosition.row) * squareSize) + (0.13 * squareSize));
								var left = (((endPosition.column - ($scope
										.getInitialPositionOfPiece(startPosition.piece)).column) * squareSize) + (0.13 * squareSize));

								element.css({

									top : whitePlayer ? top + 'px' : (top
											* (-1) + (0.26 * squareSize))
											+ 'px',
									left : whitePlayer ? left + 'px' : (left
											* (-1) + (0.26 * squareSize))
											+ 'px',

								});
							}

							$scope.updateChessboardAfterMove = function(
									element, startPosition, endPosition,
									ownMove, whitePlayer, promotedPiece) {
								var startPositionPiece = startPosition.piece;

								/* if (ownMove){ */

								/* } */

								var capture = false;
								movePieceOnBoard(element, startPosition,
										endPosition, whitePlayer);

								var startSquareIndex = findIndexOfSquare(
										startPosition.column, startPosition.row);
								var endSquareIndex = findIndexOfSquare(
										endPosition.column, endPosition.row);
								chessboard.squares[startSquareIndex].piece = "empty";
								if (chessboard.squares[endSquareIndex].piece !== "empty"
										|| pieceTakenEnPassant(startPosition,
												endPosition, whitePlayer,
												$scope.lastMove) == true) {
									capture = true;
									// console.log("EnPassant:" + enPassant);
									if (enPassant == true) {
										var indexSquareEnPassantTakenPiece = findIndexOfSquare(
												endPosition.column,
												$scope.myMove ? whitePlayer ? endPosition.row - 1
														: endPosition.row + 1
														: !whitePlayer ? endPosition.row - 1
																: endPosition.row + 1)
										$(
												"#"
														+ chessboard.squares[indexSquareEnPassantTakenPiece].piece)
												.hide();
										chessboard.squares[indexSquareEnPassantTakenPiece].piece = "empty";
										enPassant = false;
									} else {
										$(
												"#"
														+ chessboard.squares[endSquareIndex].piece)
												.hide();
									}

								}
								// console.log("PromotedPiece");
								// console.log(promotedPiece);
								if (typeof promotedPiece != 'undefined') {
									console
											.log("Promoting to:"
													+ promotedPiece);
									if (!ownMove) {
										$(element).attr(
												'src',
												'http://localhost:8082/images/pieces/'
														+ promotedPiece
														+ '.png');
									}
									// console.log(element);
									// console.log(promotedPiece
									// + endPosition.column
									// + endPosition.row);
									chessboard.squares[endSquareIndex].piece = promotedPiece
											+ endPosition.column
											+ endPosition.row;
								} else {
									// TODO Exact piece name has to be added
									chessboard.squares[endSquareIndex].piece = startPosition.piece;
								}
								var kingInCheckOrAndMate = isKingInCheckOrAndMate(
										chessboard, $scope.whiteMove,
										startPosition, endPosition);

								$scope.drawLastMove(startPosition, endPosition);
								if ($scope.castling == "0-0") {
									if (isWhitePieceOnSquare(endPosition.row,
											endPosition.column)) {
										console.log("White on move.");
										var targetSquare = {
											row : 0,
											column : 5,
											piece : "empty"
										};
										movePieceOnBoard(
												$("#WR70"),
												$scope
														.getInitialPositionOfPiece("WR70"),
												targetSquare, whitePlayer);
									} else {
										console.log("Black on move.");
										var targetSquare = {
											row : 7,
											column : 5,
											piece : "empty"
										};
										movePieceOnBoard(
												$("#BR77"),
												$scope
														.getInitialPositionOfPiece("BR77"),
												targetSquare, whitePlayer);
									}
								} else if ($scope.castling == "0-0-0") {
									if (isWhitePieceOnSquare(endPosition.row,
											endPosition.column)) {
										console.log("White on move.");
										var targetSquare = {
											row : 0,
											column : 3,
											piece : "empty"
										};
										movePieceOnBoard(
												$("#WR00"),
												$scope
														.getInitialPositionOfPiece("WR00"),
												targetSquare, whitePlayer);
									} else {
										console.log("Black on move.");
										var targetSquare = {
											row : 7,
											column : 3,
											piece : "empty"
										};
										movePieceOnBoard(
												$("#BR07"),
												$scope
														.getInitialPositionOfPiece("BR07"),
												targetSquare, whitePlayer);
									}

								}

								var annotatedMove = addAnnotation(
										chessboard.squares[endSquareIndex].piece,
										startSquareIndex,
										endSquareIndex,
										capture,
										typeof promotedPiece != 'undefined' ? true
												: false, $scope.castling,
										kingInCheckOrAndMate.check,
										kingInCheckOrAndMate.mate);
								if (ownMove) {
									sendMove(
											typeof promotedPiece != 'undefined' ? startPositionPiece
													: chessboard.squares[endSquareIndex].piece,
											startPosition, endPosition, null,
											promotedPiece);
								}

								if (kingInCheckOrAndMate.mate == true) {
									stopClocks();
									$scope
											.endGame($scope.whiteMove == true ? "1-0"
													: "0-1");

								}
								$scope.whiteMove = !$scope.whiteMove;
								if ($scope.whiteMove==true){
									console.log("Whites move.")
								}
								if ($scope.whiteMove==false){
									console.log("Blacks move.")
								}
								
							}
							
							function hasKingAlreadyMoved(color){
								chessboard.annotatedMoves
								.forEach(function(move) {
									if (color="white" && (move.white.indexOf("K")!=-1 || move.white.indexOf("0")!=-1 )){
										return true;
									}
									else if (color="black" && (move.black.indexOf("K")!=-1 || move.white.indexOf("0")!=-1 )){
										return true;
									}
								});
								return false;
							}

							function addAnnotation(piece, startSquareIndex,
									endSquareIndex, capture, promotion,
									castling, check, mate) {
								if ($scope.castling == "0-0"
										|| $scope.castling == "0-0-0") {
									var moveNotation = $scope.castling;
								} else {
									var startSquare = String
											.fromCharCode(97 + chessboard.squares[startSquareIndex].column)
											+ (chessboard.squares[startSquareIndex].row + 1);
									// //console.log(piece, endSquareIndex,
									// capture,
									// promotion, castle, startSquare);
									var pieceSymbol = (piece.indexOf("P") != -1 || promotion == true) ? capture ? startSquare
											.substr(0, 1)
											: ""
											: piece.substr(1, 1);
									var captureSymbol = capture ? "x" : "";
									var promotionSymbol = promotion == true ? '='
											+ piece.substr(1, 1)
											: "";
									var checkSymbol = check ? "+" : "";
									var mateSymbol = mate == true ? "#" : "";
									// //console.log(promotion);
									var square = String
											.fromCharCode(97 + chessboard.squares[endSquareIndex].column)
											+ (chessboard.squares[endSquareIndex].row + 1);
									var moveNotation = pieceSymbol
											+ captureSymbol + square
											+ promotionSymbol + checkSymbol
											+ mateSymbol;
								}
								// //console.log(moveNumber);
								var whiteMove = piece.indexOf("W") != -1;
								var movecomplete;
								var currentchessboard= JSON.parse(JSON.stringify(chessboard.squares));
//								for (var i = 0; i < chessboard.squares.length; i++){
//								    currentchessboard[i] = chessboard.squares[i].slice();}
								if (whiteMove) {
									chessboard.annotatedMoves[moveNumber] = {};

									chessboard.annotatedMoves[moveNumber].white = moveNotation;
									chessboard.annotatedMoves[moveNumber].black = "";
									chessboard.annotatedMoves[moveNumber].number = moveNumber + 1;
									chessboard.annotatedMoves[moveNumber].chessboardAfterWhiteMove = currentchessboard;
									chessboard.annotatedMoves[moveNumber].chessboardAfterBlackMove = [];
									// $('.notationTable tbody
									// tr:last').after('<tr><td>'+moveNumber+'</td><td>'+moveNotation+'</td></tr>');
									// //console.log(chessboard.annotatedMoves);
									movecomplete = false;
								} else {

									// //console.log(chessboard.annotatedMoves);
									chessboard.annotatedMoves[moveNumber].black = moveNotation;
									chessboard.annotatedMoves[moveNumber].chessboardAfterBlackMove = currentchessboard;
									
									// //console.log("incremented moveNumber:"+
									// moveNumber);
									movecomplete = true;
								}
								if (movecomplete) {
									moveNumber++;
								}
								$scope.annotatedMoves = chessboard.annotatedMoves;

								/*
								 * $scope .$apply(function() {
								 * 
								 * 
								 * });
								 */
								return moveNotation;
								// $(".notationtable")

							}

							function findIndexOfSquare(x, y) {
								// //console.log(x, y);
								for (var index = 0; index < chessboard.squares.length; index++) {
									if (chessboard.squares[index].column == x
											&& chessboard.squares[index].row == y) {
										// //console.log("Returning index:" +
										// index);
										return index;
									}
								}
							}

							var calculateEloChange = function(elowhite,
									eloblack, gameResultWhite, gameResultBlack) {
								// //console.log(elowhite, eloblack,
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
								// //console.log(expectedOutcomeWhite,
								// expectedOutcomeBlack,newRatingWhite,
								// newRatingBlack);

								return {
									"newRatingWhite" : newRatingWhite,
									"newRatingBlack" : newRatingBlack
								};

							}

							var initialiseChessboard = function() {
								// //console.log("Initialising chessboard.");
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
								// //console.log("Squares scope.initialised.");
								// //console.log(chessboard.squares);
								// //console.log("Pieces scope.initialised.");
								// //console.log(chessboard.pieces);

								initialised = true;

							}

							var initialiseWebSockets = function() {
								socket = new WebSocket(
										"ws://localhost:8082/actions");
								socket.onmessage = onMessage;
								socket.onerror = onError;

								function onError(event) {
									// //console.log("Error occured:" + event);

								}

								function onMessage(event) {
									// //console.log(event);
									var data = JSON.parse(event.data);
									if (data.action == "move") {
										executeReceivedMove(data);
									} else if (data.action == "startGame") {
										startGame(data);
									} else if (data.action == "offerDraw") {
										// //console.log("Received draw
										// offer.");
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
										// //console.log("Received oponent's
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
								// //console.log("displaying draw offer");
								$scope.drawOfferReceived = true;
							};

							var executeReceivedMove = function(data) {

								// //console.log("Received move:" + event.data);
								var lastReceivedMove = JSON
										.parse(data.moveInfo);
								// //console.log(moveInfo.element);
								console.log(lastReceivedMove);
								$scope.castling = lastReceivedMove.castling;
								$scope.updateChessboardAfterMove($("#"
										+ lastReceivedMove.element),
										lastReceivedMove.startPosition,
										lastReceivedMove.endPosition, false,
										$scope.whitePlayer,
										lastReceivedMove.promotedPiece);
								$scope.lastMove = lastReceivedMove;
								$scope.pressClock($scope.whitePlayer);
								$scope.myMove = true;
								$scope.castling = "";

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
								// ////console.log("updatingLog:"+new Date());
								if (whitePlayer) {
									if ($scope.whiteTime > 0
											&& $scope.playingGame == true) {
										$scope.whiteTime -= 1;
										$scope.whiteClock = generateClockTimeFromSeconds($scope.whiteTime);
									} else {
										$scope.endGame("0-1");
//										$scope.playingGame = false;
//										$scope.gameResult = "0-1";
//										stopClocks();
										return;
									}
								} else {
									if ($scope.blackTime > 0
											&& $scope.playingGame == true) {
										$scope.blackTime -= 1;
										$scope.blackClock = generateClockTimeFromSeconds($scope.blackTime);
									} else {
										$scope.endGame("1-0");
//										$scope.playingGame = false;
//										$scope.gameResult = "1-0";
//										stopClocks();
										return;
									}
								}
								clockTimer = $timeout(function() {
									$scope.onTimeout(whitePlayer)
								}, 1000);

							}

							var startClock = function(whitePlayer) {
								// console.log("Starting clock for whitePlayer:"
								// + whitePlayer);
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
								$scope.whiteMove = true;
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
								// //console.log("Starting game.");
								// //console.log(data.blackPlayer,
								// user.username);

								$scope.$apply(function() {

									// //console.log("nulling annotated moves");
									$scope.annotatedMoves = [];
									// //console.log("Setting newGame to
									// true;");

									initPage();
									$scope.newGame = true;
								});

								if (data.blackPlayer == user.username) {

									// //console.log("I am the black player.")
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
								// //console.log("My oponent is:" +
								// $scope.oponent);
								startClock(true);

							};

							$scope.displayPromotionPicker = function(elem,
									startPos, endPos) {
								startPosition = startPos;
								endPosition = endPos;
								element = elem;
								$scope.promotionSquareReached = true;

							}

							$scope.promotePiece = function(piece) {
								// console.log("piece promoted:" + piece);
								var src = element.context.src;

								$(element).attr(
										'src',
										'http://localhost:8082/images/pieces/'
												+ piece + '.png');
								$scope.updateChessboardAfterMove(element,
										startPosition, endPosition, true,
										$scope.whitePlayer, piece);
								$scope.lastMove.startPosition = startPosition;
								$scope.lastMove.endPosition = endPosition;
								// //console.log(startPosition);
								// //console.log(endPosition);
								// //console.log(getInitialPositionOfPiece(startPosition.piece).row);
								// //console.log(getInitialPositionOfPiece(startPosition.piece).column);
								$scope.pressClock(!$scope.whitePlayer);
								$scope.setMyMove(false);
								promotionSquareReached = false;
							}

							$scope.endGame = function(gameResult) {
								$("#arrow").remove();
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
								$scope.openPostGameModal(
										$scope.whitePlayerName,
										$scope.blackPlayerName,
										$scope.gameResult, $scope.whitePlayer);

								return newElos;

							}

							var postGameModalController = function($scope,
									$modalInstance, whitePlayerName,
									blackPlayerName, gameResult, whitePlayer) {

								$scope.whitePlayerName = whitePlayerName;
								$scope.blackPlayerName = blackPlayerName;
								$scope.gameResult = gameResult;
								$scope.whitePlayer = whitePlayer;
								$scope.resultMessage = function() {
									//console.log("Result message called.");
									if (gameResult == "1-0"
											&& whitePlayer == true) {
										return "Congratulation you won the game.";
									} else if (gameResult == "0-1"
											&& whitePlayer == false) {
										return "Congratulation you won the game.";
									} else if (gameResult == "1-0"
											&& whitePlayer == false) {
										return "You lost the game.";
									} else if (gameResult == "0-1"
											&& whitePlayer == true) {
										return "You lost the game.";
									} else if (gameResult == "1/2 - 1/2") {
										return "Game ended in a draw."
									} else {
										console.log(gameResult, whitePlayer);
										return "Else called."
									}

								};

								$scope.close = function() {
									console.log("Closing dialog window;");
									$modalInstance.close();
								};

								$scope.offerRematch = function() {

								};
							};

							postGameModalController['$inject'] = [ '$scope',
									'$modalInstance', 'whitePlayerName',
									'blackPlayerName', 'gameResult',
									'whitePlayer' ];

							$scope.openPostGameModal = function(
									whitePlayerName, blackPlayerName,
									gameResult, whitePlayer) {

								var dialogWindow = $modal
										.open({
											templateUrl : 'views/playingHall/postGameModal.html',
											controller : postGameModalController,
											scope : $scope.$new(true),
											resolve : {
												whitePlayerName : function() {
													return whitePlayerName
												},
												blackPlayerName : function() {
													return blackPlayerName
												},
												gameResult : function() {
													return gameResult
												},
												whitePlayer : function() {
													return whitePlayer
												}

											}

										});
							};

							$scope.offerDraw = function() {
								var drawOffer = {
									action : "offerDraw",
									oponent : $scope.oponent
								}
								// //console.log("sending draw offer to
								// server");
								socket.send(JSON.stringify(drawOffer));
							};

							$scope.drawOfferReply = function(acceptDraw) {
								var drawOffer = {
									action : "drawOfferReply",
									player : user.username,
									oponent : $scope.oponent,
									acceptDraw : acceptDraw
								}
								// //console.log("sending drawOfferReply to
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
								// //console.log(drawOffer);
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

							};
							$scope.showSeekForm = function() {
								// console.log("Seek form function called.");

								$scope.seekFormShown = true;
							};

							$scope.seekOponent = function(time, increment) {
								// console.log("Seeking oponent.");
								// console.log(time, increment);
								// //console.log("Sending seek to server.");
								var seekDetails = {

									action : "seekOponent",
									user : LoginService.getUserLoggedIn().username,
									time : parseInt(typeof time != 'undefined' ? time
											: $scope.time),
									increment : parseInt(typeof increment != 'undefined' ? increment
											: $scope.increment)

								}
								// //console.log(seekDetails.time,seekDetails.increment)
								socket.send(JSON.stringify(seekDetails));
							};

							var sendMove = function(element, startPosition,
									endPosition, kingInCheck, promotedPiece) {

								var moveAction = {
									action : "move",
									element : element,
									oponent : $scope.oponent,
									startPosition : startPosition,
									endPosition : endPosition,
									kingInCheck : kingInCheck,
									promotedPiece : promotedPiece,
									castling : $scope.castling

								};
								// //console.log(socket);
								socket.send(JSON.stringify(moveAction));

								$scope.castling = "";
								// //console.log("sending move");
								// //console.log(moveAction);
							}

							$scope.$watch("newGame", function(value) {
								// console.log("newGame changed:" + value);
								if (value == true) {
									// initPage();
								}
							});
							$scope.$watch("castling", function(value) {
								console.log("Castling changed:" + value);

							});
							// $scope.$watch("whitePlayer", function(value) {
							// ////console.log("hello from watch.:" + value);
							// // I change here
							// var val = value || null;
							// if (val) {
							// // initPage();
							// }
							// });

							var initPage = function() {
								$timeout(function() {
									chessboard = {};
									// //console.log("Getting element.");
									chessboard.element = document
											.getElementsByName("chessboardTable")[0];
									// //console.log(chessboard.element);
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

								// ////console.log("initialising controller");

								$timeout(function() {
									$scope.$apply(function() {
										initPage();
										// ////console.log("Setting
										// whitePlayer");
										$scope.whitePlayer = true;

									});
								});

							};

							init();
						} ]);