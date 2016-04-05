angular
		.module('dragModule', [])
		.directive(
				'draggable',
				[
						'$document',
						function($document) {
							return {
								link : function(scope, element, attr) {
									
									
									var top = element.prop('offsetTop');
									var left= element.prop('offsetLeft');
									var topPiece;
									var leftPiece;
									
								console.log(element.prop('offsetTop'),element.prop('offsetLeft'));
									
									var startX = 0, startY = 0, x = 0, y = 0, endX = 0, endY = 0;	
									

									element.css({
										position : 'absolute',
										cursor : 'pointer'
									});
									
									attr.$observe('draggable', function(value) {
										console.log(value);
								        if (scope.newGame===true) {
								        	
								        	console.log("New game set to true");
								        	console.log("Resetting piece to initial position");
								        	element.css({
												top : 8 + 'px',
												left : 10  + 'px'
											});
								        	startX = 0, startY = 0, x = 0, y = 0, endX = 0, endY = 0;
								        }
								        else if(value===false){
								        	console.log("New game set to false");
								        }
								      });
									
									
									
//									if(scope.newGame===true){
//										console.log("Resetting piece to initial position");
//										element.css({
//											top : (0,26*scope.squareSize) + 'px',
//											left : (0,26*scope.squareSize) + 'px'
//										});}
//									else{
//										console.log(scope.newGame);
//										console.log("Not resetting pieces");
//									}
									
									
									
									element.on('mousedown', function(event) {
										//startX = 0, startY = 0, x = 0, y = 0, endX = 0, endY = 0;
										console.log(element);
										topPiece=element.context.offsetTop;
										leftPiece=element.context.offsetLeft;
										if(scope.newGame===true){
											
											//scope.newGame=false;
											scope.initialisationComplete();
										}
										console.log(event.pageX,event.pageY,x,y)
										// Prevent default dragging of selected
										// content
										if(scope.myMove){
											console.log("My move");
										console.log(scope.myMove);
										startPosition = scope.determineRowColumn(
												event.pageX, event.pageY,scope.whitePlayer);
										console.log("Start position:");
										console.log(startPosition);
										if ((scope.whitePlayer && startPosition.piece.indexOf("W")!=-1)||(!scope.whitePlayer && startPosition.piece.indexOf("B")!=-1)){
										event.preventDefault();
										startX = event.pageX - x;
										startY = event.pageY - y;
										$document.on('mousemove', mousemove);
										$document.on('mouseup', mouseup);}
										}
										else return false;
									});

									function mousemove(event) {
										if(scope.myMove){
											event.preventDefault();
										y = event.pageY - startY;
										x = event.pageX - startX;
										element.css({
											top : y + 'px',
											left : x + 'px'
										});}
									}

									function mouseup(event) {
										
										endX = event.pageX;
										endY = event.pageY;

										endPosition = scope.determineRowColumn(endX,endY,scope.whitePlayer);
										//var moveLegal = checkIfMoveIsLegal();
										var moveIsLegal=scope.checkLegalityOfMove(element, startPosition, endPosition,
												true, scope.whitePlayer, topPiece,leftPiece);
										if (moveIsLegal){
										scope.updateChessboardAfterMove(element,startPosition,endPosition,true,scope.whitePlayer);
//										console.log(startPosition);
//										console.log(endPosition);
//										console.log(getInitialPositionOfPiece(startPosition.piece).row);
//										console.log(getInitialPositionOfPiece(startPosition.piece).column);
										scope.pressClock(!scope.whitePlayer);
										scope.setMyMove(false);
									}
										else{
											x=0,y=0;
										element.css({
											top : topPiece + 'px',
											left : leftPiece + 'px'

										});}
								

										$document.off('mousemove', mousemove);
										$document.off('mouseup', mouseup);
										
									}

						
								}
								
							};
						} ]);