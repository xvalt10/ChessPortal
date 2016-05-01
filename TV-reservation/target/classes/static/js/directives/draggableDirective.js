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
									var startPosition={};
									
								//console.log(element.prop('offsetTop'),element.prop('offsetLeft'));
									
									var startX = 0, startY = 0, x = 0, y = 0, endX = 0, endY = 0;	
									

									element.css({
										/*position : 'absolute',*/
										cursor : 'pointer'
									});
									
									attr.$observe('draggable', function(value) {
									//	console.log(value);
								        if (scope.newGame===true) {
								        	
//								        	console.log("New game set to true");
								        	console.log("Resetting piece to initial position");
								        	
								        	element.css({
												top : 8 + 'px',
												left : 10  + 'px'
											});
								      
								        	//startX = 0, startY = 0, x = 0, y = 0, endX = 0, endY = 0;
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
										
										topPiece=element.context.offsetTop;
										leftPiece=element.context.offsetLeft;
										if(scope.newGame===true){
											
											//scope.newGame=false;
											scope.initialisationComplete();
										}
										
										if(scope.myMove){
											//console.log("My move");
										console.log(scope.myMove);
										startPosition = scope.determineRowColumn(
												event.pageX, event.pageY,scope.whitePlayer);
										console.log("Start position:");
										console.log(startPosition);
										if ((scope.whitePlayer && startPosition.piece.indexOf("W")!=-1)||(!scope.whitePlayer && startPosition.piece.indexOf("B")!=-1)){
										event.preventDefault();
										//console.log("Mouse down:"+startX,startY,x,y, event.pageX,event.pageY);
										if(startX==0){
										startX = event.pageX - x;
										startY = event.pageY - y;}
										else{
											startX = startX - x;
											startY = startY - y;
											}
										//console.log("Mouse down:"+startX,startY,x,y);
										$document.on('mousemove', mousemove);
										$document.on('mouseup', mouseup);}
										}
										else return false;
									});

									function mousemove(event) {
										if(scope.myMove){
											event.preventDefault();
										//	console.log("Mouse move:"+startX,startY,x,y);
										y = event.pageY - startY;
										x = event.pageX - startX;
									//	console.log("Mouse move:"+startX,startY,x,y);
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
										console.log(startPosition);
										
										var moveIsLegal=scope.checkLegalityOfMove(startPosition, endPosition,
												scope.whitePlayer);
										if (moveIsLegal==true){
										//console.log(startPosition);
											if (startPosition.piece.indexOf("P")!=-1 && ((scope.whitePlayer==true&&endPosition.row==7)||(scope.whitePlayer==false &&endPosition.row==0))){
												//console.log(scope.whitePlayer,endPosition.row, startPosition.piece.indexOf("P"));
												//console.log("Promotion square Reached.");
												scope.displayPromotionPicker(element,startPosition, endPosition);
											}
											else{
											//console.log(startPosition);
										scope.updateChessboardAfterMove(element,startPosition,endPosition,true,scope.whitePlayer);
										scope.lastMove.startPosition=startPosition;
										scope.lastMove.endPosition=endPosition;
									//	console.log(startPosition);
//										console.log(endPosition);
//										console.log(getInitialPositionOfPiece(startPosition.piece).row);
//										console.log(getInitialPositionOfPiece(startPosition.piece).column);
										scope.pressClock(!scope.whitePlayer);
										scope.setMyMove(false);
											}
									}
										else{
											
											
											
										element.css({
											top : topPiece + 'px',
											left : leftPiece + 'px'

										});}
										x=0, y=0;
										console.log("Mouse down:"+startX,startY,x,y);
										$document.off('mousemove', mousemove);
										$document.off('mouseup', mouseup);
										
									}

						
								}
								
							};
						} ]);