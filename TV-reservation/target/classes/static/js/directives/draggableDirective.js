angular
    .module('dragModule', [])
    .directive(
        'draggable',
        [
            '$document',
            function ($document) {
                return {
                    link: function (scope, element, attr) {


                       // var top = element.prop('offsetTop');
                       // var left = element.prop('offsetLeft');
                        var topPiece;
                        var leftPiece;
                        var startPosition = {};

                        var startX = 0, startY = 0, x = 0, y = 0, endX = 0, endY = 0;
                        let positionResetAfterPromotion = false;

                        element.css({
                            cursor: 'pointer'
                        });

                        attr.$observe('draggable', function () {

                            if (scope.newGame === true) {

                                console.log("Resetting piece to initial position");

                                element.css({
                                    top: 8 + 'px',
                                    left: 10 + 'px'
                                });
                            }

                        });
                        element.on('mousedown', function (event) {
                            //startX = 0, startY = 0, x = 0, y = 0, endX = 0, endY = 0;

                            topPiece = element.context.offsetTop;
                            leftPiece = element.context.offsetLeft;
                            if (scope.newGame === true) {

                                //scope.newGame=false;
                                scope.initialisationComplete();
                            }

                            if ((scope.mode === 'playing' && scope.myMove) || scope.mode === 'analyzing') {

                                startPosition = scope.determineRowColumn(
                                    event.pageX, event.pageY, scope.whitePlayer);

                                if ((scope.whitePlayer && startPosition.piece.indexOf("W") !== -1)
                                    || (!scope.whitePlayer && startPosition.piece.indexOf("B") !== -1)
                                    || scope.mode === 'analyzing') {
                                    event.preventDefault();

                                    console.log(element.context.src);
                                    if (!positionResetAfterPromotion && element.context.src !== attr.src) {
                                        startX = 0;
                                        positionResetAfterPromotion = true;
                                    }
                                    if (startX === 0) {
                                        if(scope.rookMovedDueToCastling(startPosition.piece)){
                                            if(startPosition.piece === "WR70" || startPosition.piece === "BR77"){
                                                startX = event.pageX + (2 * scope.squareSize) -x;
                                                startY = event.pageY - y;
                                            }else if(startPosition.piece === "WR00" || startPosition.piece === "BR07"){
                                                startX = event.pageX - (3 * scope.squareSize) -x;
                                                startY = event.pageY - y;
                                            }
                                        }
                                            else {
                                            startX = event.pageX - x;
                                            startY = event.pageY - y;
                                        }
                                    } else {

                                        startX = startX - x;
                                        startY = startY - y;
                                    }

                                    $document.on('mousemove', mousemove);
                                    $document.on('mouseup', mouseup);
                                }
                            } else return false;
                        });

                        function mousemove(event) {
                            if ((scope.mode === 'playing' && scope.myMove) || scope.mode === 'analyzing') {
                                event.preventDefault();

                                y = event.pageY - startY;
                                x = event.pageX - startX;

                                element.css({
                                    top: y + 'px',
                                    left: x + 'px'
                                });
                            }
                        }

                        function mouseup(event) {

                            endX = event.pageX;
                            endY = event.pageY;

                            endPosition = scope.determineRowColumn(endX, endY, scope.whitePlayer);

                            var moveIsLegal = scope.checkLegalityOfMove(startPosition, endPosition,
                                scope.whitePlayer);
                            if (moveIsLegal == true) {

                                if (startPosition.piece.indexOf("P") !== -1 && ((scope.whitePlayer === true && endPosition.row === 7)
                                    || (scope.whitePlayer === false && endPosition.row === 0))) {
                                    scope.displayPromotionPicker(element, startPosition, endPosition);
                                } else {
                                    //console.log(startPosition);
                                    scope.updateChessboardAfterMove(startPosition.piece, element, startPosition, endPosition, true, scope.whitePlayer);

                                    scope.lastMove.startPosition = startPosition;
                                    scope.lastMove.endPosition = endPosition;
                                    scope.pressClock(!scope.whitePlayer);
                                    scope.setMyMove(false);
                                }
                            } else {


                                element.css({
                                    top: topPiece + 'px',
                                    left: leftPiece + 'px'

                                });
                            }
                            x = 0, y = 0;
                            console.log("Mouse down:" + startX, startY, x, y);
                            $document.off('mousemove', mousemove);
                            $document.off('mouseup', mouseup);
                        }

                        function isPieceOnSquare(square, piece) {
                            return square.piece.indexOf(piece) !== -1;
                        }
                    }

                };
            }]);