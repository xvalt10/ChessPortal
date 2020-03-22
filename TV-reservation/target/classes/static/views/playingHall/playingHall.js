'use strict';

angular
    .module(
        'myApp.BoardModule',
        ['ngRoute', 'ui.bootstrap', 'reservationFilters', 'constants'])

    .controller(
        'BoardCtrl',
        [
            'ReservationService',
            'LoginService',
            'WebSocketService',
            '$scope',
            '$rootScope',
            '$modal',
            '$q',
            '$http',
            '$timeout', '$routeParams', '$location',
            function (ReservationService, LoginService, WebSocketService, $scope,
                      $rootScope, $modal, $q, $http, $timeout, $routeParams, $location) {

                let controller = this;
                let chessboard;
                let squareSize;
                let startPosition;
                let endPosition;
                let moveNumber;
                let socket;
                let user;
                let clockTimer;
                let enPassant;
                let element;
                $scope.castling = null;
                $scope.lastMove = {};
                let positionOccurrencesMap = new Map();

                let variationId = 0;
                $scope.mode = "playing";
                $scope.squareSize = 55;
                $scope.playingGame = null;
                $scope.seekingOponent = null;
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
                $scope.scrollbarconfig = {
                    setHeight: 400,
                };
                $scope.currentVariation = null;

                $scope.variations = new Map();

                $scope.initialisationComplete = function () {
                    $scope.$apply(function () {
                        $scope.newGame = false;
                    });

                };

                $scope.$on("$destroy", function () {
                    if ($scope.mode === 'observing') {
                        stopObservingGame();
                    }
                    stopClocks();
                });

                let stopObservingGame = function () {
                    $http.get('observe/' + $routeParams.observedPlayer + "/cancel", {}).success(function () {
                        console.log("Removing of observer successfull.");
                    }).error(function (data) {
                        console.log("Removing of observer failed:" + data.error);
                    });
                };

                $scope.setMyMove = function (isItMyMove) {
                    $scope.myMove = isItMyMove;
                };

                let getChessboardCoordinates = function (obj) {
                    let top;
                    top = 0;
                    if (obj.offsetParent) {
                        do {
                            top += obj.offsetTop;
                        } while (obj = obj.offsetParent);
                    }

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

                $scope.activateAnalysisMode = function () {
                    $scope.mode = "analyzing";
                };

                $scope.determineRowColumn = function (x, y,
                                                      whitePlayer) {

                    let coordinates = {};
                    coordinates.x = (x - chessboard.coordinates.left)
                        / squareSize;
                    coordinates.y = 8 - ((y - (chessboard.coordinates.top)) / squareSize);
                    let row = !whitePlayer ? 7 - Math
                        .floor(coordinates.y) : Math
                        .floor(coordinates.y);
                    let column = !whitePlayer ? 7 - Math
                        .floor(coordinates.x) : Math
                        .floor(coordinates.x);

                    return {
                        row: row,
                        column: column,
                        piece: chessboard.squares[findIndexOfSquare(
                            column, row)].piece
                    };

                };


                $scope.getInitialPositionOfPiece = function (piece) {
                    let coordinates = {};
                    for (let index = 0; index < chessboard.pieces.length; index++) {
                        if (chessboard.pieces[index].piece === piece) {
                            coordinates.row = chessboard.pieces[index].row;
                            coordinates.column = chessboard.pieces[index].column;
                            coordinates.piece = piece;
                            coordinates.index = index;
                            return coordinates;
                        }
                    }
                };

                $scope.goToNextMove = function(){
                    let move;
                    if(!$scope.currentVariation){
                        move = chessboard.annotatedMoves[moveNumber];
                        if(!$scope.whiteMove){
                            $scope.redrawChessboard(move.chessboardAfterBlackMove,
                                'annotatedMoveBlack'+(moveNumber+1), false, moveNumber+1);
                        }else{
                            $scope.redrawChessboard(move.chessboardAfterWhiteMove,
                                'annotatedMoveWhite'+(moveNumber+1), true, moveNumber+1);
                        }
                    } else{
                        move = $scope.currentVariation.moves[moveNumber - $scope.currentVariation.moveNumber];
                        let variationId = $scope.currentVariation.variationId;
                        if(!$scope.whiteMove){
                            $scope.redrawChessboard(move.chessboardAfterBlackMove,
                                'annotatedMoveBlack'+(moveNumber+1), false, moveNumber+1,variationId);
                        }else{
                            $scope.redrawChessboard(move.chessboardAfterWhiteMove,
                                'annotatedMoveWhite'+(moveNumber+1), true, moveNumber+1,variationId);
                        }
                    }



                }

                function isRookMoveLegal(startPosition, endPosition, kingInCheck) {
                    let isLegal = true;
                    if (endPosition.row === startPosition.row) {
                        for (let x = 1; x < Math
                            .abs(endPosition.column
                                - startPosition.column); x++) {
                            let square = findSquare(endPosition.column > startPosition.column ? startPosition.column
                                + x
                                : startPosition.column
                                - x, startPosition.row);
                            if ((!kingInCheck && !isSquareEmpty(square)) ||
                                (kingInCheck && !isSquareEmpty(square) && !isPieceOnSquare(square, "K"))) {
                                isLegal = false;
                            }
                        }

                    } else if (endPosition.column === startPosition.column) {
                        for (let x = 1; x < Math
                            .abs(endPosition.row
                                - startPosition.row); x++) {
                            let square = findSquare(startPosition.column,
                                endPosition.row > startPosition.row ? startPosition.row
                                    + x
                                    : startPosition.row - x);
                            if ((!kingInCheck && !isSquareEmpty(square)) ||
                                (kingInCheck && !isSquareEmpty(square) && !isPieceOnSquare(square, "K"))) {
                                isLegal = false;
                            }
                        }
                    } else {
                        isLegal = false;
                    }
                    // console.log("Rook move legal:" + isLegal);
                    return isLegal;
                }

                function isPawnMoveLegal(startPosition,
                                         endPosition, whitePlayer, kingInCheck) {
                    if (Math.abs(startPosition.row
                        - endPosition.row) > 2
                        || Math.abs(startPosition.column
                            - endPosition.column) > 1) {
                        return false;
                    } else if (($scope.whiteMove === true && endPosition.row < startPosition.row) || ($scope.whiteMove === false && endPosition.row > startPosition.row)) {
                        return false;
                    } else if (Math
                            .abs(!whitePlayer ? startPosition.row
                                - endPosition.row
                                : endPosition.row
                                - startPosition.row) === 1
                        && Math.abs(startPosition.column
                            - endPosition.column) === 1
                        && (endPosition.piece !== "empty" || (kingInCheck))) {
                        return true;
                    } else if (Math
                            .abs(!whitePlayer ? startPosition.row
                                - endPosition.row
                                : endPosition.row
                                - startPosition.row) === 1
                        && startPosition.column
                        - endPosition.column === 0 && (endPosition.piece === "empty")) {
                        return true;
                    } else if (Math
                            .abs(!whitePlayer ? startPosition.row
                                - endPosition.row
                                : endPosition.row
                                - startPosition.row) === 2
                        && startPosition.column
                        - endPosition.column === 0) {
                        let initialPositionOfPiece = $scope
                            .getInitialPositionOfPiece(startPosition.piece);
                        return startPosition.row === initialPositionOfPiece.row
                            && startPosition.column === initialPositionOfPiece.column;
                    } else if (!whitePlayer ? startPosition.row
                        - endPosition.row : endPosition.row
                        - startPosition.row === 1
                        && Math.abs(endPosition.column
                            - startPosition.column) === 1) {
                        return pieceTakenEnPassant(startPosition,
                            endPosition, whitePlayer,
                            $scope.lastMove);

                    }
                }

                function pieceTakenEnPassant(startPosition,
                                             endPosition, whitePlayer) {
                    // console.log("En passant function called.");
                    console
                        .log(startPosition.piece.indexOf("P") !== -1);
                    let squaresMovedForward;
                    if ($scope.myMove === true) {
                        squaresMovedForward = !whitePlayer ? startPosition.row
                            - endPosition.row
                            : endPosition.row
                            - startPosition.row;
                    } else {
                        squaresMovedForward = Math
                            .abs(startPosition.row
                                - endPosition.row);
                    }
                    if (startPosition.piece.indexOf("P") !== -1
                        && squaresMovedForward === 1
                        && Math.abs(endPosition.column
                            - startPosition.column) === 1) {
                        // console.log(lastMove);
                        if ($scope.lastMove.endPosition.piece
                                .indexOf("P") !== -1
                            && Math
                                .abs($scope.lastMove.startPosition.row
                                    - $scope.lastMove.endPosition.row) === 2
                            && $scope.lastMove.endPosition.column === endPosition.column) {
                            // console.log("En passant.");
                            enPassant = true;
                            return true;
                        } else
                            return false;

                    }
                }

                function canRookMateBePrevented(chessboard,
                                                kingPosition, checkingPiecePosition,
                                                whiteMove) {
                    let matePreventionPossible = false;
                    if (kingPosition.row === checkingPiecePosition.row) {
                        for (let x = 1; x < Math
                            .abs(kingPosition.column
                                - checkingPiecePosition.column); x++) {

                            if (canAnyOponentsPieceMoveToSquare(
                                chessboard,
                                kingPosition.row,
                                kingPosition.column > checkingPiecePosition.column ? checkingPiecePosition.column
                                    + x
                                    : checkingPiecePosition.column
                                    - x, whiteMove) === true) {

                                matePreventionPossible = true;
                                break;
                            }

                        }

                    } else if (kingPosition.column === checkingPiecePosition.column) {
                        for (let x = 1; x < Math
                            .abs(kingPosition.row
                                - checkingPiecePosition.row); x++) {

                            if (canAnyOponentsPieceMoveToSquare(
                                chessboard,
                                kingPosition.row > checkingPiecePosition.row ? checkingPiecePosition.row
                                    + x
                                    : checkingPiecePosition.row
                                    - x,
                                kingPosition.column, whiteMove) === true) {

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
                    let matePreventionPossible = false;
                    if (kingPosition.row > checkingPiecePosition.row
                        && kingPosition.column > checkingPiecePosition.column) {
                        for (let x = 1; x < kingPosition.row
                        - checkingPiecePosition.row; x++) {
                            if (canAnyOponentsPieceMoveToSquare(
                                chessboard,
                                checkingPiecePosition.row + x,
                                checkingPiecePosition.column
                                + x, whiteMove) === true) {
                                console.log("Yes - option 1");
                                matePreventionPossible = true;
                                break;
                            }

                        }

                    } else if (kingPosition.row > checkingPiecePosition.row
                        && kingPosition.column < checkingPiecePosition.column) {
                        for (let x = 1; x < endPosition.row
                        - checkingPiecePosition.row; x++) {
                            if (canAnyOponentsPieceMoveToSquare(
                                chessboard, kingPosition.row
                                - x,
                                kingPosition.column + x,
                                whiteMove) === true) {
                                console.log("Yes - option 2");
                                matePreventionPossible = true;
                                break;
                            }

                        }

                    } else if (kingPosition.row < checkingPiecePosition.row
                        && kingPosition.column > checkingPiecePosition.column) {
                        for (let x = 1; x < startPosition.row
                        - endPosition.row; x++) {
                            if (canAnyOponentsPieceMoveToSquare(
                                chessboard, kingPosition.row
                                + x,
                                kingPosition.column - x,
                                whiteMove) === true) {
                                console.log("Yes - option 3");
                                matePreventionPossible = true;
                                break;
                            }

                        }

                    } else if (kingPosition.row < checkingPiecePosition.row
                        && kingPosition.column < checkingPiecePosition.column) {
                        for (let x = 1; x < checkingPiecePosition.row
                        - endPosition.row; x++) {
                            if (canAnyOponentsPieceMoveToSquare(
                                chessboard, kingPosition.row
                                + x,
                                kingPosition.column + x,
                                whiteMove) === true) {
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
                    let matePreventionPossible = false;

                    if (canAnyOponentsPieceMoveToSquare(
                        chessboard,
                        checkingPiecePosition.row,
                        checkingPiecePosition.column,
                        whiteMove, true)) {

                        matePreventionPossible = true;
                    } else {

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
                                    checkingPiecePosition, whiteMove) === true
                                    || canRookMateBePrevented(
                                        chessboard, kingPosition,
                                        checkingPiecePosition,
                                        whiteMove) === true) {
                                    matePreventionPossible = true;
                                }
                                break;

                        }
                    }
                    return matePreventionPossible;
                }

                function isKingMoveLegal(startPosition,
                                         endPosition, whitePlayer, isKingInCheck) {
                    if (Math.abs(endPosition.row
                        - startPosition.row) <= 1
                        && Math.abs(endPosition.column
                            - startPosition.column) <= 1
                    ) {
                        if (startPosition.piece.indexOf('W') !== -1 ? isWhitePieceOnSquare(endPosition) : isBlackPieceOnSquare(endPosition)) {
                            //same coloured piece as the king is on the target square, king move is illegal
                            return false;
                        } else {
                            return !canAnyOponentsPieceMoveToSquare(chessboard, endPosition.row, endPosition.column, startPosition.piece.indexOf('W') !== -1, true, isKingInCheck);
                        }


                    } else if (endPosition.row === startPosition.row
                        && Math.abs(endPosition.column
                            - startPosition.column) === 2
                        && endPosition.column === 6) {
                        if (whitePlayer === true
                            && isSquareEmpty(findSquare(5, 0))
                            && !canAnyOponentsPieceMoveToSquare(
                                chessboard, 0, 5,
                                $scope.whiteMove)
                            && isSquareEmpty(findSquare(6, 0))
                            && !canAnyOponentsPieceMoveToSquare(
                                chessboard, 0, 6,
                                $scope.whiteMove) && hasKingAlreadyMoved("white") === false) {
                            console.log("White Short castle");
                            $scope.castling = "0-0";
                            return true;
                        }

                        if (whitePlayer === false
                            && endPosition.column === 6
                            && isSquareEmpty(findSquare(5, 7))
                            && !canAnyOponentsPieceMoveToSquare(
                                chessboard, 7, 5,
                                $scope.whiteMove)
                            && isSquareEmpty(findSquare(6, 7))
                            && !canAnyOponentsPieceMoveToSquare(
                                chessboard, 7, 6,
                                $scope.whiteMove) && hasKingAlreadyMoved("black") === false) {
                            console.log("Black Short castle");
                            $scope.castling = "0-0";
                            return true;
                        }


                    } else if (endPosition.row === startPosition.row
                        && Math.abs(endPosition.column
                            - startPosition.column) === 2
                        && (endPosition.column === 2)) {
                        if (whitePlayer === true
                            && isSquareEmpty(findSquare(2, 0))
                            && !canAnyOponentsPieceMoveToSquare(
                                chessboard, 0, 2,
                                $scope.whiteMove, true)
                            && isSquareEmpty(findSquare(3, 0))
                            && !canAnyOponentsPieceMoveToSquare(
                                chessboard, 0, 3,
                                $scope.whiteMove, true) && hasKingAlreadyMoved("white") === false) {
                            console.log("White Long castle");
                            $scope.castling = "0-0-0";
                            return true;
                        }

                        if (whitePlayer === false
                            && isSquareEmpty(findSquare(2, 7))
                            && !canAnyOponentsPieceMoveToSquare(
                                chessboard, 7, 2,
                                $scope.whiteMove, true)
                            && isSquareEmpty(findSquare(3, 7))
                            && !canAnyOponentsPieceMoveToSquare(
                                chessboard, 7, 3,
                                $scope.whiteMove, true) && hasKingAlreadyMoved("black") === false) {

                            console.log("Black Long castle");
                            $scope.castling = "0-0-0";
                            return true;
                        }
                    } else {
                        console.log("King else condition.");
                        console.log(startPosition);
                        console.log(endPosition);
                        console.log(whitePlayer);
                        return false;
                    }
                }

                function isBishopMoveLegal(startPosition,
                                           endPosition, kingInCheck) {
                    let isLegal = true;
                    if (Math.abs(endPosition.row
                        - startPosition.row) === Math
                        .abs(endPosition.column
                            - startPosition.column)

                    ) {
                        if ((endPosition.row > startPosition.row
                            && endPosition.column > startPosition.column) ||
                            (endPosition.row < startPosition.row
                                && endPosition.column < startPosition.column)) {
                            for (let x = 1; x < endPosition.row
                            - startPosition.row; x++) {
                                let square = findSquare(startPosition.column + x,
                                    startPosition.row + x);
                                if ((!kingInCheck && !isSquareEmpty(square)) ||
                                    (kingInCheck && !isSquareEmpty(square) && !isPieceOnSquare(square, "K"))) {
                                    // console.log("Case1");
                                    isLegal = false;
                                    break;
                                }


                            }

                        } else if (endPosition.row > startPosition.row
                            && endPosition.column < startPosition.column) {
                            for (let x = 1; x < endPosition.row
                            - startPosition.row; x++) {
                                let square = findSquare(
                                    endPosition.column + x,
                                    endPosition.row - x);

                                if ((!kingInCheck && !isSquareEmpty(square)) ||
                                    (kingInCheck && !isSquareEmpty(square) && !isPieceOnSquare(square, "K"))) {

                                    console
                                        .log(square.piece);

                                    isLegal = false;
                                    break;
                                }

                            }

                        } else if (endPosition.row < startPosition.row
                            && endPosition.column > startPosition.column) {
                            for (let x = 1; x < startPosition.row
                            - endPosition.row; x++) {
                                let square = findSquare(
                                    endPosition.column - x,
                                    endPosition.row + x);
                                if ((!kingInCheck && !isSquareEmpty(square)) ||
                                    (kingInCheck && !isSquareEmpty(square) && !isPieceOnSquare(square, "K"))) {
                                    // console.log("Case3");
                                    isLegal = false;
                                    break;
                                }


                            }

                        }

                        /*     else if (endPosition.row < startPosition.row
                                 && endPosition.column < startPosition.column) {
                                 for (let x = 1; x < startPosition.row
                                 - endPosition.row; x++) {
                                     let square = findSquare(
                                         endPosition.column + x,
                                         endPosition.row + x)
                                     if ((!kingInCheck && !isSquareEmpty(square)) ||
                                         (kingInCheck && !isSquareEmpty(square) && !isPieceOnSquare(square, "K"))) {

                                         // console.log("Case4");
                                         isLegal = false;
                                         break;
                                     }


                                 }

                             }*/

                    } else {
                        // console.log("Case 5");
                        isLegal = false;
                    }
                    // console.log("Bishop move legal:" + isLegal);
                    return isLegal;
                }


                $scope.checkLegalityOfMove = function (
                    startPosition, endPosition, whitePlayer, isKingInCheck) {

                    if (typeof endPosition === 'undefined' || startPosition.piece === "empty" ||
                        (endPosition.row === startPosition.row && endPosition.column === startPosition.column) ||
                        (isWhitePieceOnSquare(startPosition) && isWhitePieceOnSquare(endPosition)) ||
                        (isBlackPieceOnSquare(startPosition) && isBlackPieceOnSquare(endPosition))
                    ) {
                        return false;
                    }

                    switch (startPosition.piece.substr(1, 1)) {
                        case "N":

                            if (((Math.abs(startPosition.row
                                - endPosition.row) === 2 && Math
                                    .abs(startPosition.column
                                        - endPosition.column) === 1) || (Math
                                    .abs(startPosition.row
                                        - endPosition.row) === 1 && Math
                                    .abs(startPosition.column
                                        - endPosition.column) === 2))
                                && (($scope.whiteMove ? isBlackPieceOnSquare(endPosition) : isWhitePieceOnSquare(endPosition))
                                    || isSquareEmpty(endPosition) || isKingInCheck)) {
                                return true;
                            } else {
                                return false;
                            }

                        case "P":
                            return isPawnMoveLegal(startPosition,
                                endPosition, whitePlayer, isKingInCheck);
                        case "K":

                            return isKingMoveLegal(startPosition,
                                endPosition, $scope.mode === 'analyzing' ? $scope.whiteMove : whitePlayer);
                        case "B":
                            return isBishopMoveLegal(startPosition,
                                endPosition, isKingInCheck);
                        case "R":
                            return isRookMoveLegal(startPosition,
                                endPosition, isKingInCheck);
                        case "Q":
                            return isBishopMoveLegal(startPosition,
                                endPosition, isKingInCheck)
                                || isRookMoveLegal(startPosition,
                                    endPosition, isKingInCheck);
                        default:
                            return true;
                    }

                };

                function isSquareEmpty(square) {
                    return square.piece === "empty";
                }

                function isBlackPieceOnSquare(square) {
                    return square.piece.indexOf("W") === -1 && !isSquareEmpty(square);
                }

                function isWhitePieceOnSquare(square) {
                    return square.piece.indexOf("W") !== -1 && !isSquareEmpty(square);
                }

                function isPieceOnSquare(square, piece) {
                    return square.piece.indexOf(piece) !== -1;
                }

                function canAnyOponentsPieceMoveToSquare(
                    chessboard, row, column, whiteMove, ignoreKings, isKingInCheck = false) {
                    let pieceFound = false;
                    let targetSquare = findSquare(column, row);
                    let colour = whiteMove ? "black" : "white";
                    console.log("Can any " + colour + " piece move to square " + getSquareAsString(targetSquare) + "?");

                    for (let i = 0; i < chessboard.squares.length; i++) {
                        let initialSquare = chessboard.squares[i];
                        if (ignoreKings === true && initialSquare.piece.indexOf('K') !== -1) {
                            continue;
                        }
                        if (!isSquareEmpty(initialSquare)) {
                            if ((whiteMove === true && isBlackPieceOnSquare(
                                initialSquare))
                                || (whiteMove === false && isWhitePieceOnSquare(
                                    initialSquare))) {


                                if ($scope
                                    .checkLegalityOfMove(
                                        initialSquare,
                                        targetSquare,
                                        $scope.whitePlayer, isKingInCheck) === true) {

                                    console
                                        .log("Following piece can move to target square " + getSquareAsString(targetSquare) + ": "
                                            + initialSquare.piece
                                            + ".");
                                    pieceFound = true;
                                    break;
                                }
                            }
                        }
                    }
                    return pieceFound;

                }

                function isKingMated(chessboard, kingPosition,
                                     checkingPiecePosition) {

                    let x = [1, 1, 1, -1, -1, -1, 0, 0];
                    let y = [0, 1, -1, 0, 1, -1, 1, -1];
                    let numberOfLegalSquareForKingMove = 8;

                    for (let i = 0; i < x.length; i++) {

                        let targetSquareIndex = findIndexOfSquare(
                            kingPosition.column + x[i],
                            kingPosition.row + y[i]);
                        let targetSquare = chessboard.squares[targetSquareIndex];
                        if (typeof targetSquare !== 'undefined' && isKingMoveLegal(kingPosition, targetSquare, $scope.whitePlayer, true) === false) {
                            console.log("Retracting square:"
                                + getSquareAsString(targetSquare));
                            numberOfLegalSquareForKingMove--;
                        } else if (typeof targetSquare === 'undefined') {
                            console.log("Retracting invalid square:"
                                + (kingPosition.column + x[i]) + " " + (kingPosition.row + y[i]));
                            numberOfLegalSquareForKingMove--;
                        } else {
                            console
                                .log("Valid square for king move:"
                                    + getSquareAsString(targetSquare));
                        }

                    }
                    if (numberOfLegalSquareForKingMove > 0) {
                        // console.log("King not mated:"
                        // + numberOfLegalSquareForKingMove);
                        return false;
                    } else {
                        console.log("King has no squares.");
                        if (canMateBePrevented(chessboard,
                            kingPosition,
                            checkingPiecePosition, $scope.whiteMove) === true) {
                            console.log("Mate can be prevented.");
                            return false;
                        }
                        // console.log("King is mated.");
                        else {
                            return true;
                        }
                    }
                }

                function isKingInCheckOrAndMate(chessboard,
                                                whiteMove, startPosition, endPosition) {
                    let kingPosition = {};
                    let kingInCheckOrAndMate = {};
                    kingInCheckOrAndMate.check = false;
                    kingInCheckOrAndMate.mate = false;

                    chessboard.squares
                        .forEach(function (square) {
                            if (endPosition.piece.indexOf("W") !== -1 ? square.piece
                                .indexOf("BK") !== -1
                                : square.piece
                                .indexOf("WK") !== -1) {
                                kingPosition.row = square.row;
                                kingPosition.column = square.column;
                                kingPosition.piece = square.piece;
                            }

                        });

                    if ($scope.checkLegalityOfMove(
                        endPosition,
                        kingPosition,
                        $scope.whiteMove, false) === true) {
                        console.log("Checking piece " + endPosition.piece);
                        kingInCheckOrAndMate.check = true;
                        kingInCheckOrAndMate.mate = isKingMated(
                            chessboard,
                            kingPosition,
                            endPosition);
                    } else {
                        chessboard.squares
                            .forEach(function (square) {
                                if ($scope.whiteMove === false ? isBlackPieceOnSquare(square)
                                    : isWhitePieceOnSquare(square)) {
                                    if ($scope.checkLegalityOfMove(
                                        square,
                                        kingPosition,
                                        $scope.whiteMove, false) === true) {
                                        console.log("Checking piece " + square.piece);
                                        kingInCheckOrAndMate.check = true;
                                        kingInCheckOrAndMate.mate = isKingMated(
                                            chessboard,
                                            kingPosition,
                                            endPosition);
                                    }
                                }


                            });
                    }
                    return kingInCheckOrAndMate;

                }

                $scope.redrawChessboard = function (currentSquares, elementId, whiteMove, moveNo, variationId) {
                    console.log("Position after redraw of position:");
                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                      printSquares(chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                        printSquares(chessboard.annotatedMoves[0].chessboardAfterBlackMove);}

                    /*console.log("Redrawing board");
                    console.log(printSquares(currentSquares));*/

                    if ($scope.playingGame === false || $scope.mode === "observing" || $scope.mode === "analyzing") {
                        for (let int = 0; int < currentSquares.length; int++) {
                            if (currentSquares[int].piece !== "empty") {
                                $scope.movePieceToCoordinates(currentSquares[int].piece,
                                    currentSquares[int].row, currentSquares[int].column);
                                $("#"+ currentSquares[int].piece).show();
                            }
                        }
                    }
                    if (typeof elementId !== 'undefined') {
                        $('td[id ^= "annotatedMove"]').css('font-weight', 'normal');
                        $('td[id ^= "moveOfVariation"]').css('font-weight', 'normal');
                        $("#" + elementId).css('font-weight', 'bold');
                    }

                    if ($scope.mode === "analyzing") {
                        if(typeof variationId === 'undefined'){
                            $scope.currentVariation = null;
                        } else{
                            $scope.currentVariation = $scope.variations.get(variationId);
                        }
                        if(whiteMove){
                            if(!$scope.currentVariation){
                            $scope.drawLastMove(chessboard.annotatedMoves[moveNo-1].whiteMoveStartSquare, chessboard.annotatedMoves[moveNo-1].whiteMoveEndSquare);}
                            else{
                                let variationMove = $scope.currentVariation.moves[moveNo-1-$scope.currentVariation.moveNumber];
                                $scope.drawLastMove(variationMove.whiteMoveStartSquare, variationMove.whiteMoveEndSquare);
                            }
                        }else{
                            if(!$scope.currentVariation){
                            $scope.drawLastMove(chessboard.annotatedMoves[moveNo-1].blackMoveStartSquare, chessboard.annotatedMoves[moveNo-1].blackMoveEndSquare);}
                            else{
                                let variationMove = $scope.currentVariation.moves[moveNo-1-$scope.currentVariation.moveNumber];
                                $scope.drawLastMove(variationMove.blackMoveStartSquare, variationMove.blackMoveEndSquare);
                            }
                        }
                        $scope.whiteMove = !whiteMove;
                        chessboard.squares = JSON.parse(JSON.stringify(currentSquares));
                        printCurrentChessboard();
                        if(whiteMove){
                            moveNumber = moveNo - 1;
                        }else {
                            moveNumber = moveNo;
                        }


                        console.log("Position after end of redraw of position:");
                        if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                            printSquares(chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                        if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                            printSquares(chessboard.annotatedMoves[0].chessboardAfterBlackMove);}

                    }

                };

                $scope.drawLastMove = function (startPosition,
                                                endPosition) {
                    console.log("Drawing move");
                    console.log(startPosition, endPosition);
                    let chessboardsize = document.getElementById("chessboardOverlay").offsetWidth;
                    let squaresize = Math.floor(chessboardsize / 8);

                    createLine(
                        $scope.whitePlayer ?
                            (startPosition.column + 1) * squaresize - squaresize / 2 :
                            (8 - startPosition.column) * squaresize - squaresize / 2,
                        $scope.whitePlayer ?
                            (8 - startPosition.row) * squaresize - squaresize / 2 :
                            (startPosition.row) * squaresize + squaresize / 2,
                        $scope.whitePlayer ?
                            (endPosition.column + 1) * squaresize - squaresize / 2 :
                            (8 - endPosition.column) * squaresize - squaresize / 2,
                        $scope.whitePlayer ?
                            (8 - endPosition.row) * squaresize - (!$scope.whiteMove ? 0.5 * squaresize : squaresize / 2) :
                            (endPosition.row) * squaresize + (!$scope.whiteMove ? 0.5 * squaresize : squaresize / 2)
                    );

                    eraseAllHighlightedSquares();
                    highlightSquare(startPosition, squaresize, squaresize);
                    highlightSquare(endPosition, squaresize, squaresize);

                };

                function eraseAllHighlightedSquares() {
                    $(".rect").remove();
                }

                function highlightSquare(square, width, height) {
                    let y = $scope.whitePlayer ? (7 - square.row) * width : (square.row) * width;
                    let x = $scope.whitePlayer ? (square.column) * width : (7 - square.column) * width;
                    let svgNS = "http://www.w3.org/2000/svg";
                    let rectangular = document.createElementNS(svgNS, "rect");
                    rectangular.setAttributeNS(null, 'class', 'rect');
                    rectangular.setAttributeNS(null, 'x', x.toString());
                    rectangular.setAttributeNS(null, 'y', y.toString());
                    rectangular.setAttributeNS(null, 'width', width.toString());
                    rectangular.setAttributeNS(null, 'height', height.toString());
                    rectangular.setAttributeNS(null, 'style', 'fill:none;stroke:yellow;stroke-width:2');

                    document.getElementById("svgId").appendChild(rectangular);

                    return rectangular

                }

                function createLineElement(x1, y1, x2, y2) {
                    let svgNS = "http://www.w3.org/2000/svg";
                    let line = document.createElementNS(svgNS, "path");
                    line.setAttributeNS(null, "id", "arrow");
                    line.setAttributeNS(null, "stroke-width", '4');
                    line.setAttributeNS(null, "marker-end", "url(#head)");
                    line.setAttributeNS(null, "fill", "none");
                    line.setAttributeNS(null, "stroke", "blue");

                    line.setAttributeNS(null, "opacity", "0.2");
                    line.setAttributeNS(null, "d", 'M' + Math.floor(x1) + " " + Math.floor(y1) + " " + Math.floor(x2) + " " + Math.floor(y2));

                    return line;
                }

                function createLine(x1, y1, x2, y2) {
                    $("#arrow").remove();

                    let line = createLineElement(x1, y1, x2, y2);
                    document.getElementById("svgId").appendChild(line);


                }

                $scope.movePieceToCoordinates = function (piece, row, column) {

                    let top = (((($scope
                        .getInitialPositionOfPiece(piece).row) - row) * squareSize) + (0.13 * squareSize));
                    let left = (((column - ($scope
                        .getInitialPositionOfPiece(piece)).column) * squareSize) + (0.13 * squareSize));

                    $("#" + piece).css({

                        top: $scope.whitePlayer ? top + 'px' : (top
                            * (-1) + (0.26 * squareSize))
                            + 'px',
                        left: $scope.whitePlayer ? left + 'px' : (left
                            * (-1) + (0.26 * squareSize))
                            + 'px',

                    });

                };

                function movePieceOnBoard(element, startPosition,
                                          endPosition, whitePlayer) {
                    let top = (((($scope
                        .getInitialPositionOfPiece(startPosition.piece).row) - endPosition.row) * squareSize) + (0.13 * squareSize));
                    let left = (((endPosition.column - ($scope
                        .getInitialPositionOfPiece(startPosition.piece)).column) * squareSize) + (0.13 * squareSize));

                    element.css({
                        top: whitePlayer ? top + 'px' : (top
                            * (-1) + (0.26 * squareSize))
                            + 'px',
                        left: whitePlayer ? left + 'px' : (left
                            * (-1) + (0.26 * squareSize))
                            + 'px',
                    });
                }

                $scope.updateChessboardAfterMove = function (startPiece,
                                                             element, startSquare, endSquare,
                                                             ownMove, whitePlayer, promotedPiece) {

                    console.log("Position before start updatechessboard:");
                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                        printSquares(chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                        printSquares(chessboard.annotatedMoves[0].chessboardAfterBlackMove);}

                    let capture = false;
                    movePieceOnBoard(element, startSquare,
                        endSquare, whitePlayer);


                    console.log("Position vefore en passant:");
                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                        printSquares(chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                        printSquares(chessboard.annotatedMoves[0].chessboardAfterBlackMove);}

                    if (!isSquareEmpty(endSquare)
                        || pieceTakenEnPassant(startSquare,
                            endSquare, whitePlayer) === true) {
                        capture = true;

                        if (enPassant === true) {

                            let enPassantPawnTakenRow = $scope.myMove ?
                                whitePlayer ? endSquare.row - 1 : endSquare.row + 1
                                : !whitePlayer ? endSquare.row - 1 : endSquare.row + 1;
                            let enPassantPawnSquare = findSquare(endSquare.column, enPassantPawnTakenRow);
                            $("#" + enPassantPawnSquare.piece).hide();
                            enPassantPawnSquare.piece = "empty";
                            enPassant = false;
                        } else {
                            $("#" + endSquare.piece).hide();
                        }
                    }



                    if (typeof promotedPiece !== 'undefined') {
                        let promotedPieceFullName = promotedPiece + endSquare.column + endSquare.row;

                        $(element).prop('id', promotedPieceFullName);
                        $(element).css('top', "8px");
                        $(element).css('left', "10px");
                        $(element).attr('src', 'http://localhost:8082/images/pieces/' + promotedPiece + '.png');
                        $(element).detach().appendTo('#squareDiv' + endSquare.column + endSquare.row);

                        /*let indexOfNewPiece =chessboard.pieces.length;
                        chessboard.pieces[indexOfNewPiece] = {};
                        chessboard.pieces[indexOfNewPiece].row = endSquare.row;
                        chessboard.pieces[indexOfNewPiece].column = endSquare.column;
                        chessboard.pieces[indexOfNewPiece].piece = promotedPieceFullName;*/



                        let indexOfPiece = $scope.getInitialPositionOfPiece(startPiece).index;
                        chessboard.pieces[indexOfPiece].column = endSquare.column;
                        chessboard.pieces[indexOfPiece].row = endSquare.row;
                        chessboard.pieces[indexOfPiece].piece = promotedPieceFullName;

                        endSquare.piece = promotedPieceFullName;
                        findSquare(endSquare.column, endSquare.row).piece = promotedPieceFullName;
                        startSquare.piece = "empty";
                        findSquare(startSquare.column, startSquare.row).piece = "empty"
                    } else {

                        endSquare.piece = startPiece;
                        findSquare(endSquare.column, endSquare.row).piece = startPiece;
                        startSquare.piece = "empty";
                        findSquare(startSquare.column, startSquare.row).piece = "empty";

                    }



                    if (hasThreeFoldRepetitionOccurred()) {
                        $scope.endGame("1/2 - 1/2 (three fold repetition)");
                        if ($scope.whitePlayer) {
                            sendGameResult();
                        }
                    }
                    let kingInCheckOrAndMate = isKingInCheckOrAndMate(
                        chessboard, $scope.whiteMove,
                        startSquare, endSquare);



                    $scope.drawLastMove(startSquare, endSquare);


                    if($scope.castling ==="0-0" || $scope.castling === "0-0-0"){
                    moveRookIfPlayerCastled();}


                    let annotatedMove = addAnnotation(
                        startSquare,
                        endSquare,
                        capture,
                        typeof promotedPiece !== 'undefined', $scope.castling,
                        kingInCheckOrAndMate.check,
                        kingInCheckOrAndMate.mate);

                    if (ownMove && $scope.mode === 'playing') {
                        sendMove(
                            typeof promotedPiece !== 'undefined' ? startPiece
                                : endSquare.piece,
                            startSquare, endSquare, null,
                            promotedPiece, annotatedMove);
                    }

                    if (kingInCheckOrAndMate.mate === true) {
                        $scope
                            .endGame($scope.whiteMove === true ? "1-0"
                                : "0-1");
                        sendGameResult();

                    }

                    $scope.castling = "";
                    $scope.whiteMove = !$scope.whiteMove;


                };


                function moveRookIfPlayerCastled() {
                    let targetSquare;
                    let piece;
                    let initialSquare;
                    let initialSquareCoordinates;

                    if ($scope.castling === "0-0") {

                        if ($scope.whiteMove) {
                            piece = "WR70";
                            targetSquare = findSquare(5,0);
                            initialSquareCoordinates =  $scope
                                .getInitialPositionOfPiece("WR70");
                            initialSquare = findSquare(initialSquareCoordinates.column,initialSquareCoordinates.row);
                        } else {
                            targetSquare = findSquare(5,7);
                            piece = "BR77";
                            initialSquareCoordinates =  $scope
                                .getInitialPositionOfPiece(piece);
                            initialSquare = findSquare(initialSquareCoordinates.column,initialSquareCoordinates.row);
                        }
                    } else if ($scope.castling === "0-0-0") {
                        if ($scope.whiteMove) {
                            console.log("White on move.");
                            targetSquare = findSquare(3,0);
                            piece = "WR00";
                            initialSquareCoordinates = $scope
                                .getInitialPositionOfPiece(piece);
                            initialSquare = findSquare(initialSquareCoordinates.column, initialSquareCoordinates.row);

                        } else {
                            console.log("Black on move.");
                            targetSquare = findSquare(3,7);
                            piece = "BR07";
                            initialSquareCoordinates = $scope
                                .getInitialPositionOfPiece(piece);
                            initialSquare = findSquare(initialSquareCoordinates.column, initialSquareCoordinates.row);

                        }
                    }

                    movePieceOnBoard(
                        $("#"+piece),
                        initialSquareCoordinates,
                        targetSquare, $scope.whitePlayer);

                    targetSquare.piece = piece;
                    findSquare(targetSquare.column, targetSquare.row).piece = piece;
                    initialSquare.piece = "empty";
                    findSquare(initialSquare.column, initialSquare.row).piece = "empty";
                    printCurrentChessboard();
                }

                function hasThreeFoldRepetitionOccurred() {

                    let threefoldrepetitionOccurred = false;
                    let chessboardAsString = printCurrentChessboard();
                    let numberOfOccurrences = 0;
                    if (positionOccurrencesMap.has(chessboardAsString)) {
                        numberOfOccurrences = positionOccurrencesMap.get(chessboardAsString) + 1;
                    }
                    positionOccurrencesMap.set(chessboardAsString, numberOfOccurrences);
                    if (numberOfOccurrences === 3) {
                        threefoldrepetitionOccurred = true;
                    }
                    return threefoldrepetitionOccurred;

                }

                function hasKingAlreadyMoved(color) {
                    let hasKingAlreadyMoved = false;
                    chessboard.annotatedMoves
                        .forEach(function (move) {
                            if (color === "white" && (move.whiteMove.indexOf("K") !== -1 || move.whiteMove.indexOf("0") !== -1)) {
                                hasKingAlreadyMoved = true;
                            } else if (color === "black" && (move.blackMove.indexOf("K") !== -1 || move.blackMove.indexOf("0") !== -1)) {
                                hasKingAlreadyMoved = true;
                            }
                        });
                    return hasKingAlreadyMoved;
                }

                $scope.rookMovedDueToCastling = function (piece) {
                    let rookMovedDueToCastling = false;
                    chessboard.annotatedMoves
                        .forEach(function (move) {
                            if (piece === 'WR70' && move.whiteMove.indexOf("0-0") !== -1) {
                                rookMovedDueToCastling =  true;
                            } else if (piece === 'WR00' && move.whiteMove.indexOf("0-0-0") !== -1) {
                                rookMovedDueToCastling =  true;
                            } else if (piece === 'BR07' && move.blackMove.indexOf("0-0-0") !== -1) {
                                rookMovedDueToCastling =  true;
                            } else if (piece === 'BR77' && move.blackMove.indexOf("0-0") !== -1) {
                                rookMovedDueToCastling =  true;
                            }


                        });
                    return rookMovedDueToCastling;
                };

                function printSquares(squares) {
                    let chessboardAsString = "";
                    for (let rowIndex = 7; rowIndex >= 0; rowIndex--) {
                        for (let columnIndex = 0; columnIndex <= 7; columnIndex++) {
                            let squareIndex;
                            for (let index = 0; index < squares.length; index++) {
                                if (squares[index].column === columnIndex
                                    && squares[index].row === rowIndex) {

                                    squareIndex = index;
                                    break;
                                }
                            }

                            let piece = squares[squareIndex].piece;
                            if (piece === 'empty') {
                                piece = '-';
                            } else {
                                if (piece.indexOf("W") !== -1) {
                                    piece = piece.toLowerCase();
                                }
                                piece = piece.substring(1, 2);

                            }
                            chessboardAsString += piece;
                            if (columnIndex !== 0 && columnIndex % 7 === 0) {
                                chessboardAsString += "\n";
                            }
                        }


                    }

                    console.log(chessboardAsString);
                    return chessboardAsString;
                }

                function printCurrentChessboard() {
                    let chessboardAsString = "";
                    for (let rowIndex = 7; rowIndex >= 0; rowIndex--) {
                        for (let columnIndex = 0; columnIndex <= 7; columnIndex++) {

                            let piece = findSquare(columnIndex, rowIndex).piece;
                            if (piece === 'empty') {
                                piece = '-';
                            } else {
                                if (piece.indexOf("W") !== -1) {
                                    piece = piece.toLowerCase();
                                }
                                piece = piece.substring(1, 2);

                            }
                            chessboardAsString += piece;
                            if (columnIndex !== 0 && columnIndex % 7 === 0) {
                                chessboardAsString += "\n";
                            }
                        }


                    }

                    console.log(chessboardAsString);
                    return chessboardAsString;
                }

                function addAnnotation(startSquare,
                                       endSquare, capture, promotion,
                                       castling, check, mate) {

                    let moveNotation;
                    if (castling === "0-0" || castling === "0-0-0") {
                        moveNotation = castling;
                    } else {
                        let pieceSymbol = (isPieceOnSquare(endSquare, "P") || promotion === true) ?
                            capture ? getSquareAsString(startSquare).substring(0, 1) : ""
                            : endSquare.piece.substr(1, 1);
                        let captureSymbol = capture ? "x" : "";
                        let promotionSymbol = promotion === true ? '=' + endSquare.piece.substr(1, 1) : "";
                        let checkSymbol = check ? "+" : "";
                        let mateSymbol = mate === true ? "#" : "";

                        let endSquareAsString = getSquareAsString(endSquare);
                        moveNotation = pieceSymbol
                            + captureSymbol + endSquareAsString
                            + promotionSymbol + checkSymbol
                            + mateSymbol;
                    }

                    console.log("Position after start of annotation:");
                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                   printSquares(chessboard.annotatedMoves[0].chessboardAfterWhiteMove)}
                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                    printSquares(chessboard.annotatedMoves[0].chessboardAfterBlackMove)}

                    let whiteMove = endSquare.piece.indexOf("W") !== -1;
                    let movecomplete;
                    let currentchessboard = JSON.parse(JSON.stringify(chessboard.squares));

                    if (whiteMove) {
                        let newMove = addNewAnnotatedMove(moveNotation, currentchessboard, whiteMove, startSquare, endSquare);

                        if (chessboard.annotatedMoves.length > moveNumber || $scope.currentVariation) {

                            if (!$scope.currentVariation) {
                                //adding white move to main line
                                let variations = chessboard.annotatedMoves[moveNumber].whiteMoveVariations;
                                let numberOfVariations = variations.length;
                                let newVariationNeedsToBeCreated = true;
                                for (let i = 0; i < numberOfVariations; i++) {
                                    if (variations[i].moves[0].whiteMove === newMove.whiteMove) {
                                        $scope.currentVariation = variations[i];
                                        newVariationNeedsToBeCreated = false;
                                        break;
                                    }
                                }

                                if (newVariationNeedsToBeCreated) {
                                    console.log("Position after start Of create variation:");
                                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                                        printSquares(chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                                        printSquares(chessboard.annotatedMoves[0].chessboardAfterBlackMove);}
                                    chessboard.annotatedMoves[moveNumber].whiteMoveVariations[numberOfVariations] = {moves: []};
                                    chessboard.annotatedMoves[moveNumber].whiteMoveVariations[numberOfVariations].moves[0] = newMove;
                                    chessboard.annotatedMoves[moveNumber].whiteMoveVariations[numberOfVariations].variationId = variationId;
                                    $scope.currentVariation = {
                                        "variationId": variationId,
                                        "moveNumber": moveNumber,
                                        "whiteMove": whiteMove,
                                        "variationIndex": numberOfVariations,
                                        "moves": chessboard.annotatedMoves[moveNumber].whiteMoveVariations[numberOfVariations].moves
                                    };
                                    $scope.variations.set(variationId, $scope.currentVariation);
                                    variationId++;
                                    console.log("Position end of create variation:");
                                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                                        printSquares(chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                                        printSquares(chessboard.annotatedMoves[0].chessboardAfterBlackMove);}
                                }

                            } else {
                                //adding white move to an existing variation
                                let variation = $scope.variations.get($scope.currentVariation.variationId);
                                let moveNumberInVariation = moveNumber - variation.moveNumber;
                                if(variation.moves.length > moveNumberInVariation){
                                    let newVariationNeedsToBeCreated = true;
                                    let variations = variation.moves[moveNumberInVariation].whiteMoveVariations;
                                    let numberOfVariations = variations.length;

                                    for (let i = 0; i < numberOfVariations; i++) {
                                        if (variations[i].moves[0].whiteMove === newMove.whiteMove) {
                                            $scope.currentVariation = variations[i];
                                            newVariationNeedsToBeCreated = false;
                                            break;
                                        }
                                    }

                                    if (newVariationNeedsToBeCreated) {
                                        console.log("Creating new variation: "+variationId +" with the white starting move "+newMove.whiteMove);
                                        console.log(printSquares(newMove.chessboardAfterWhiteMove));

                                        variation.moves[moveNumberInVariation].whiteMoveVariations[numberOfVariations] = {moves:[]};
                                        variation.moves[moveNumberInVariation].whiteMoveVariations[numberOfVariations].moves[0] = newMove;
                                        variation.moves[moveNumberInVariation].whiteMoveVariations[numberOfVariations].variationId = variationId;
                                        $scope.currentVariation = {
                                            "variationId": variationId,
                                            "parentVariationId": variation.variationId,
                                            "moveNumber": moveNumber,
                                            "whiteMove": whiteMove,
                                            "variationIndex": numberOfVariations,
                                            "moves": variation.moves[moveNumberInVariation].whiteMoveVariations[numberOfVariations].moves
                                        };
                                        $scope.variations.set($scope.currentVariation.variationId, $scope.currentVariation);
                                        variationId++;
                                    }

                                }else{
                                    //adding white move to existing variation
                                    variation.moves[variation.moves.length] = newMove;
                                }
                            }
                        } else {

                            chessboard.annotatedMoves[moveNumber] = newMove;
                            console.log("Position after new mainline white move:");
                            if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                                printSquares(chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                            if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                                printSquares(chessboard.annotatedMoves[0].chessboardAfterBlackMove);}
                        }

                        movecomplete = false;
                    } else {

                        //annotating black move
                        if ($scope.currentVariation || chessboard.annotatedMoves[moveNumber].blackMove !== "") {
                            if (!$scope.currentVariation) {

                                let variations = chessboard.annotatedMoves[moveNumber].blackMoveVariations;
                                let numberOfVariations = variations.length;
                                let newVariationNeedsToBeCreated = true;

                                if(numberOfVariations===0 && chessboard.annotatedMoves[moveNumber].blackMove === moveNotation){
                                    newVariationNeedsToBeCreated = false;
                                }else {
                                    for (let i = 0; i < numberOfVariations; i++) {
                                        if (variations[i].moves[0].blackMove === moveNotation) {
                                            newVariationNeedsToBeCreated = false;
                                            $scope.currentVariation = variations[i];
                                            break;
                                        }
                                    }
                                }

                                if (newVariationNeedsToBeCreated) {
                                    console.log("Chessboard in the mainline start:");
                                    console.log(printSquares(chessboard.annotatedMoves[0].chessboardAfterWhiteMove));
                                    console.log(printSquares(chessboard.annotatedMoves[0].chessboardAfterBlackMove));
                                    //new variation with a black starting move created
                                    chessboard.annotatedMoves[moveNumber].blackMoveVariations[numberOfVariations] = {moves: []};
                                    let newMove = addNewAnnotatedMove(moveNotation, currentchessboard, whiteMove, startSquare, endSquare);
                                    chessboard.annotatedMoves[moveNumber].blackMoveVariations[numberOfVariations].moves[0] = newMove;
                                    chessboard.annotatedMoves[moveNumber].blackMoveVariations[numberOfVariations].variationId = variationId;
                                    $scope.currentVariation = {
                                        "variationId": variationId,
                                        "moveNumber": moveNumber,
                                        "whiteMove": whiteMove,
                                        "variationIndex": numberOfVariations,
                                        "moves":chessboard.annotatedMoves[moveNumber].blackMoveVariations[numberOfVariations].moves
                                    };
                                    $scope.variations.set($scope.currentVariation.variationId, $scope.currentVariation);
                                    variationId++;

                                    console.log("Creating new variation: "+variationId +" with the black starting move "+newMove.blackMove);
                                    console.log(printSquares(newMove.chessboardAfterBlackMove));
                                    console.log("Chessboard in the mainline end:");

                                    console.log(printSquares(chessboard.annotatedMoves[0].chessboardAfterWhiteMove));
                                    console.log(printSquares(chessboard.annotatedMoves[0].chessboardAfterBlackMove));
                                }
                            } else {
                                //adding black move to an existing variation
                                let variation = $scope.variations.get($scope.currentVariation.variationId);
                                let newVariationNeedsToBeCreated = true;
                                let moveNumberInVariation = moveNumber - variation.moveNumber;

                                if(variation.moves[moveNumberInVariation].blackMove !== "") {

                                    let variations = variation.moves[moveNumberInVariation].blackMoveVariations;
                                    let numberOfVariations = variations.length;

                                    for (let i = 0; i < numberOfVariations; i++) {
                                        if (variations[i].moves[0].blackMove === moveNotation) {
                                            newVariationNeedsToBeCreated = false;
                                            $scope.currentVariation = variations[i];
                                            break;
                                        }
                                    }

                                    //adding variation starting with a black move
                                    if (newVariationNeedsToBeCreated) {
                                        variation.moves[moveNumberInVariation].blackMoveVariations[numberOfVariations] = {moves: []};
                                        variation.moves[moveNumberInVariation].blackMoveVariations[numberOfVariations].moves[0] = addNewAnnotatedMove(moveNotation, currentchessboard, whiteMove);
                                        variation.moves[moveNumberInVariation].blackMoveVariations[numberOfVariations].variationId = variationId;
                                        $scope.currentVariation = {
                                            "variationId": variationId,
                                            "parentVariationId": variation.variationId,
                                            "moveNumber": moveNumber,
                                            "whiteMove": whiteMove,
                                            "variationIndex": numberOfVariations,
                                            "moves": variation.moves[moveNumberInVariation].blackMoveVariations[numberOfVariations].moves
                                        };
                                        $scope.variations.set($scope.currentVariation.variationId, $scope.currentVariation);
                                        variationId++;
                                    }
                                } else{
                                    console.log("Position before adding black move to existing variation:");
                                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                                        printSquares(chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                                        printSquares(chessboard.annotatedMoves[0].chessboardAfterBlackMove);}

                                    variation.moves[variation.moves.length - 1].blackMove = moveNotation;
                                    variation.moves[variation.moves.length - 1].blackMoveStartSquare = startSquare;
                                    variation.moves[variation.moves.length - 1].blackMoveEndSquare = endSquare;
                                    variation.moves[variation.moves.length - 1].chessboardAfterBlackMove = currentchessboard;

                                    console.log("Position after adding black move to existing variation:");
                                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterWhiteMove !== 'undefined' ){
                                        printSquares(chessboard.annotatedMoves[0].chessboardAfterWhiteMove);}
                                    if(chessboard.annotatedMoves.length > 0 && typeof chessboard.annotatedMoves[0].chessboardAfterBlackMove !== 'undefined' && chessboard.annotatedMoves[0].chessboardAfterBlackMove.length!==0){
                                        printSquares(chessboard.annotatedMoves[0].chessboardAfterBlackMove);}
                                }
                            }

                        } else {

                            chessboard.annotatedMoves[moveNumber].blackMove = moveNotation;
                            chessboard.annotatedMoves[moveNumber].blackMoveStartSquare = startSquare;
                            chessboard.annotatedMoves[moveNumber].blackMoveEndSquare = endSquare;
                            chessboard.annotatedMoves[moveNumber].chessboardAfterBlackMove = currentchessboard;

                            console.log("Position after new mainline black move:");
                            printSquares(chessboard.annotatedMoves[0].chessboardAfterWhiteMove);
                            printSquares(chessboard.annotatedMoves[0].chessboardAfterBlackMove);
                        }
                        movecomplete = true;
                    }

                    if (movecomplete) {
                        moveNumber++;
                    }
                    $scope.annotatedMoves = chessboard.annotatedMoves;
                    $scope.updateScrollbar('scrollTo', 440);

                    return moveNotation;
                }

                function addNewAnnotatedMove(moveNotation, currentchessboard, whiteMove, startSquare, endSquare) {
                    let newAnnotatedMove = {};
                    newAnnotatedMove.whiteMove = whiteMove ? moveNotation : "";
                    newAnnotatedMove.blackMove = whiteMove ? "" : moveNotation;
                    newAnnotatedMove.whiteMoveStartSquare = whiteMove ? startSquare : "";
                    newAnnotatedMove.whiteMoveEndSquare = whiteMove ? endSquare : "";
                    newAnnotatedMove.blackMoveStartSquare = whiteMove ? "" : startSquare;
                    newAnnotatedMove.blackMoveEndSquare = whiteMove ? "" : endSquare;
                    newAnnotatedMove.whiteMoveVariations = [];
                    newAnnotatedMove.blackMoveVariations = [];
                    newAnnotatedMove.moveNumber = moveNumber + 1;
                    newAnnotatedMove.chessboardAfterWhiteMove = whiteMove ? currentchessboard : [];
                    newAnnotatedMove.chessboardAfterBlackMove = whiteMove ? [] : currentchessboard;
                    return newAnnotatedMove;
                }

                function getSquareAsString(square) {
                    return String
                            .fromCharCode(97 + square.column)
                        + (square.row + 1);
                }

                function findIndexOfSquare(x, y) {
                    for (let index = 0; index < chessboard.squares.length; index++) {
                        if (chessboard.squares[index].column === x
                            && chessboard.squares[index].row === y) {

                            return index;
                        }
                    }
                }

                function findSquare(x, y) {
                    return chessboard.squares[findIndexOfSquare(x, y)];
                }

                let updatePlayerElos = function (gameResultWhite, gameResultBlack) {
                    // //console.log(elowhite, eloblack,
                    // gameResultWhite, gameResultBlack);
                    let expectedOutcomeWhite = 1 / (1 + Math.pow(
                        10, ($scope.blackPlayerElo - $scope.whitePlayerElo) / 400));
                    let expectedOutcomeBlack = 1 / (1 + Math.pow(
                        10, ($scope.whitePlayerElo - $scope.blackPlayerElo) / 400));
                    let newRatingWhite = Math
                        .round($scope.whitePlayerElo
                            + 15
                            * (gameResultWhite - expectedOutcomeWhite));
                    let newRatingBlack = Math
                        .round($scope.blackPlayerElo
                            + 15
                            * (gameResultBlack - expectedOutcomeBlack));

                    $scope.whitePlayerEloChange = $scope.whitePlayerElo - newRatingWhite;
                    $scope.blackPlayerEloChange = $scope.blackPlayerElo - newRatingBlack;
                    $scope.whitePlayerElo = newRatingWhite;
                    $scope.blackPlayerElo = newRatingBlack;


                    /*return {
                        "newRatingWhite": newRatingWhite,
                        "newRatingBlack": newRatingBlack
                    };*/

                };

                let initialiseChessboard = function () {

                    controller.initialised = false;
                    chessboard = {};
                    chessboard.element = document.getElementsByName("chessboardTable")[0];
                    chessboard.pieces = [];
                    chessboard.annotatedMoves = [];
                    squareSize = 0;
                    startPosition = {};
                    endPosition = {};

                    moveNumber = 0;
                    chessboard.coordinates = {};

                    getChessboardCoordinates(chessboard.element);

                    let index = 0;
                    let pieceIndex = 0;
                    let squares = [];
                    let piece;
                    for (let x = 0; x <= 7; x++) {
                        for (let y = 0; y <= 7; y++) {
                            piece = "";
                            squares[index] = {};
                            squares[index].row = y;
                            squares[index].column = x;
                            if (y === 6) {

                                piece = "BP" + x + y;

                            } else if (y === 1) {
                                piece = "WP" + x + y;
                            } else if (y === 0) {
                                if (x === 0 || x === 7) {
                                    piece = "WR" + x + y;
                                } else if (x === 1 || x === 6) {
                                    piece = "WN" + x + y;
                                } else if (x === 2 || x === 5) {
                                    piece = "WB" + x + y;
                                } else if (x === 3) {
                                    piece = "WQ" + x + y;
                                } else if (x === 4) {
                                    piece = "WK" + x + y;
                                }
                            } else if (y === 7) {
                                if (x === 0 || x === 7) {
                                    piece = "BR" + x + y;
                                } else if (x === 1 || x === 6) {
                                    piece = "BN" + x + y;
                                } else if (x === 2 || x === 5) {
                                    piece = "BB" + x + y;
                                } else if (x === 3) {
                                    piece = "BQ" + x + y;
                                } else if (x === 4) {
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
                    controller.initialised = true;


                };

                let initialiseWebSockets = function () {
                    socket = WebSocketService.initWebSockets();
                    socket.onmessage = onMessage;
                    socket.onerror = onError;
                    socket.onopen = onOpen;

                    function onOpen() {
                        console.log("opening session and requesting game info");

                    }

                    function onError(event) {
                        // //console.log("Error occured:" + event);

                    }

                    function onMessage(event) {

                        let data = JSON.parse(event.data);
                        if (data.action === "move") {
                            executeReceivedMove(data);
                        } else if (data.action === "startGame") {
                            startGame(data);
                        } else if (data.action === "offerDraw") {
                            displayDrawOffer();
                        } else if (data.action === "drawOfferReply") {
                            if (data.acceptDraw === true) {
                                $scope
                                    .$apply(function () {
                                        $scope
                                            .endGame("1/2 - 1/2");
                                    });
                            } else {

                            }
                        } else if (data.action === "resign") {
                            $scope
                                .$apply(function () {
                                    $scope
                                        .endGame($scope.whitePlayer ? "1-0"
                                            : "0-1");
                                });
                        } else if (data.action === "gameInfo") {
                            startGame(data);
                        } else if (data.action === "gameResult") {
                            $scope.endGame(data.gameResult);
                        }
                    }
                };

                let displayDrawOffer = function () {
                    $scope.drawOfferReceived = true;
                };

                let executeReceivedMove = function (lastReceivedMove) {

                    console.log(lastReceivedMove);
                    $scope.castling = lastReceivedMove.castling;
                    let startSquare = findSquare(lastReceivedMove.startPosition.column, lastReceivedMove.startPosition.row);
                    let endSquare = findSquare(lastReceivedMove.endPosition.column, lastReceivedMove.endPosition.row);
                    let clickedPiece = $("#" + lastReceivedMove.element);
                    $scope.updateChessboardAfterMove(startSquare.piece, clickedPiece,
                        startSquare,
                        endSquare, false,
                        $scope.whitePlayer,
                        lastReceivedMove.promotedPiece);

                    $scope.lastMove = lastReceivedMove;
                    $scope.whiteTime = lastReceivedMove.whiteTime;
                    $scope.blackTime = lastReceivedMove.blackTime;
                    $scope.pressClock(!lastReceivedMove.whiteMove);
                    $scope.myMove = true;
                    $scope.castling = "";

                };
                let generateClockTimeFromSeconds = function (seconds) {
                    let clockSeconds = seconds % 60;
                    if (clockSeconds < 10) {
                        clockSeconds = "0" + clockSeconds
                    }
                    let clockMinutes = Math.floor(seconds / 60);
                    return clockMinutes + ":" + clockSeconds
                };

                $scope.onTimeout = function (whitePlayer) {
                    if (whitePlayer) {
                        if ($scope.whiteTime > 0
                            // && $scope.playingGame === true
                        ) {
                            $scope.whiteTime -= 1;
                            $scope.whiteClock = generateClockTimeFromSeconds($scope.whiteTime);
                            console.log("Decreasing white time.")
                        } else {
                            if ($scope.whitePlayer === whitePlayer) {
                                $scope.endGame("0-1 (Black won on time)");
                                sendGameResult();
                            }
                            return;
                        }
                    } else {
                        if ($scope.blackTime > 0
                            //&& $scope.playingGame === true
                        ) {
                            $scope.blackTime -= 1;
                            $scope.blackClock = generateClockTimeFromSeconds($scope.blackTime);
                        } else {
                            if ($scope.whitePlayer === whitePlayer) {
                                $scope.endGame("1-0 (White won on time)");
                                sendGameResult();
                            }
                            return;
                        }
                    }
                    if ($scope.playingGame || $scope.mode === "observing") {
                        clockTimer = $timeout(function () {
                            $scope.onTimeout(whitePlayer)
                        }, 1000);
                    }

                };

                let startClock = function (whitePlayer) {
                    console.log("Starting clock for whitePlayer:"
                        + whitePlayer);
                    clockTimer = $timeout($scope
                        .onTimeout(whitePlayer), 1000);

                };

                $scope.pressClock = function (whitePlayer) {
                    console.log("Pressing clock");
                    $timeout.cancel(clockTimer);
                    startClock(whitePlayer);
                };

                let stopClocks = function () {
                    console.log("Stopping clock");
                    $timeout.cancel(clockTimer);

                };

                let startGame = function (data) {
                    console.log("starting game");
                    $(".chessPiece").show();
                    eraseAllHighlightedSquares();
                    moveNumber = 0;
                    $scope.seekingOponent = false;
                    $scope.playingGame = true;
                    $scope.whiteMove = true;
                    $scope.gameResult = "";
                    $scope.whiteTime = data.time * 60;
                    $scope.blackTime = data.time * 60;
                    $scope.drawOfferReceived = false;
                    $scope.whitePlayerElo = data.whitePlayer.elo;
                    $scope.blackPlayerElo = data.blackPlayer.elo;
                    $scope.whitePlayerName = data.whitePlayer.username;
                    $scope.blackPlayerName = data.blackPlayer.username;
                    $scope.whiteClock = generateClockTimeFromSeconds($scope.whiteTime);
                    $scope.blackClock = generateClockTimeFromSeconds($scope.blackTime);

                    $scope.$apply(function () {
                        initialiseChessboard();
                        if ($scope.mode === "observing") {
                            $scope.annotatedMoves = data.annotatedMoves;
                        }
                        $scope.newGame = true;
                    });

                    if (data.blackPlayer.username === $rootScope.user) {
                        $scope.$apply(function () {
                            $scope.oponent = data.whitePlayer.username;
                            $scope.whitePlayer = false;
                        });

                    } else {

                        $scope.$apply(function () {
                            $scope.oponent = data.blackPlayer.username;
                            $scope.whitePlayer = true;
                            $scope.myMove = true;

                        });
                    }
                    //startClock(true);

                };

                $scope.displayPromotionPicker = function (elem,
                                                          startPos, endPos) {
                    startPosition = startPos;
                    endPosition = endPos;
                    element = elem;
                    $scope.promotionSquareReached = true;

                };

                $scope.promotePiece = function (piece) {

                    $scope.updateChessboardAfterMove(startPosition.piece, element,
                        startPosition, endPosition, true,
                        $scope.whitePlayer, piece);
                    $scope.lastMove.startPosition = startPosition;
                    $scope.lastMove.endPosition = endPosition;
                    $scope.pressClock(!$scope.whitePlayer);
                    $scope.setMyMove(false);
                    $scope.promotionSquareReached = false;

                };

                $scope.endGame = function (gameResult) {
                    $("#arrow").remove();
                    let gameResultWhite;
                    let gameResultBlack;
                    if (gameResult === "1-0" || gameResult === "1-0 (White won on time)") {
                        gameResultWhite = 1;
                        gameResultBlack = 0;
                    } else if (gameResult === "0-1" || gameResult === "0-1 (Black won on time)") {
                        gameResultWhite = 0;
                        gameResultBlack = 1;
                    } else if (gameResult === "1/2 - 1/2") {
                        gameResultWhite = 0.5;
                        gameResultBlack = 0.5;
                    }
                    stopClocks();
                    $scope.playingGame = false;

                    let newElos = updatePlayerElos(
                        gameResultWhite,
                        gameResultBlack);


                    $scope.gameResult = gameResult;

                    $scope.openPostGameModal(
                        $scope.whitePlayerName,
                        $scope.blackPlayerName,
                        $scope.gameResult, $scope.whitePlayer, $scope.mode);

                    return newElos;

                };

                var postGameModalController = function ($scope,
                                                        $modalInstance, whitePlayerName,
                                                        blackPlayerName, gameResult, whitePlayer, mode) {

                    $scope.whitePlayerName = whitePlayerName;
                    $scope.blackPlayerName = blackPlayerName;
                    $scope.gameResult = gameResult;
                    $scope.whitePlayer = whitePlayer;
                    $scope.resultMessage = function () {
                        if (mode === "playing" && ((gameResult === "1-0"
                            && whitePlayer === true) || (gameResult === "0-1"
                            && whitePlayer === false))) {
                            return "Congratulation you won the game.";
                        } else if (mode === "playing" && ((gameResult === "1-0 (White won on time)"
                            && whitePlayer === true) || (gameResult === "0-1 (Black won on time)"
                            && whitePlayer === false))) {
                            return "Congratulation you won the game on time.";
                        } else if (mode === "playing" && ((gameResult === "1-0 (White won on time)"
                            && whitePlayer === false) || (gameResult === "0-1 (Black won on time)"
                            && whitePlayer === true))) {
                            return "You lost the game on time.";
                        } else if (mode === "playing" && ((gameResult === "1-0"
                            && whitePlayer === false) || (gameResult === "0-1"
                            && whitePlayer === true))) {
                            return "You lost the game.";
                        } else if (gameResult === "1-0" &&
                            mode === "observing") {
                            return whitePlayerName + " won the game.";
                        } else if (gameResult === "0-1"
                            && mode === "observing") {
                            return blackPlayerName + " won the game.";
                        } else if (gameResult === "1-0 (White won on time)" &&
                            mode === "observing") {
                            return whitePlayerName + " won the game on time.";
                        } else if (gameResult === "0-1 (Black won on time)"
                            && mode === "observing") {
                            return blackPlayerName + " won the game on time.";
                        } else if (gameResult === "1/2 - 1/2") {
                            return "Game ended in a draw."
                        } else {
                            console.log(gameResult, whitePlayer);
                            return "Else called."
                        }

                    };

                    $scope.close = function () {
                        console.log("Closing dialog window;");
                        $modalInstance.close();
                    };

                    $scope.offerRematch = function () {

                    };
                };

                postGameModalController['$inject'] = ['$scope',
                    '$modalInstance', 'whitePlayerName',
                    'blackPlayerName', 'gameResult',
                    'whitePlayer', 'mode'];

                $scope.openPostGameModal = function (
                    whitePlayerName, blackPlayerName,
                    gameResult, whitePlayer, mode) {

                    $modal
                        .open({
                            templateUrl: 'views/playingHall/postGameModal.html',
                            controller: postGameModalController,
                            scope: $scope.$new(true),
                            resolve: {
                                whitePlayerName: function () {
                                    return whitePlayerName
                                },
                                blackPlayerName: function () {
                                    return blackPlayerName
                                },
                                gameResult: function () {
                                    return gameResult
                                },
                                whitePlayer: function () {
                                    return whitePlayer
                                },
                                mode: function () {
                                    return mode
                                }
                            }
                        });
                };

                $scope.offerDraw = function () {
                    let drawOffer = {
                        action: "offerDraw",
                        oponent: $scope.oponent
                    };
                    socket.send(JSON.stringify(drawOffer));
                };

                $scope.drawOfferReply = function (acceptDraw) {
                    let drawOffer = {
                        action: "drawOfferReply",
                        player: user.username,
                        oponent: $scope.oponent,
                        acceptDraw: acceptDraw
                    };

                    if (acceptDraw) {
                        $scope.endGame("1/2 - 1/2");
                        sendGameResult();

                    } else {
                        socket.send(JSON.stringify(drawOffer));
                    }
                };

                let sendGameResult = function () {
                    let gameResult = {
                        action: "gameResult",
                        oponent: $scope.oponent,
                        gameId: $routeParams.gameId,
                        gameResult: $scope.gameResult,
                        whitePlayerElo: $scope.whitePlayerElo,
                        blackPlayerElo: $scope.blackPlayerElo
                    };

                    socket.send(JSON.stringify(gameResult));
                };
                $scope.resign = function () {
                    let gameResult = !$scope.whitePlayer ? "1-0" : "0-1";
                    $scope.endGame(gameResult);
                    sendGameResult();
                };

                let observeGame = function (game) {

                    $scope.whitePlayerName = game.whitePlayer.username;
                    $scope.blackPlayerName = game.blackPlayer.username;
                    $scope.whitePlayerElo = game.whitePlayer.elo;
                    $scope.blackPlayerElo = game.blackPlayer.elo;
                    $scope.annotatedMoves = Object.values(game.annotatedMoves);

                    let lastMove = $scope.annotatedMoves[$scope.annotatedMoves.length - 1];
                    $scope.whiteTime = lastMove.whiteTime;
                    $scope.blackTime = lastMove.blackTime;
                    $scope.whiteClock = generateClockTimeFromSeconds($scope.whiteTime);
                    $scope.blackClock = generateClockTimeFromSeconds($scope.blackTime);

                    if (lastMove.blackMove) {
                        $scope.redrawChessboard(JSON.parse(lastMove.chessboardAfterBlackMove));
                        startClock(true)
                    } else {
                        $scope.redrawChessboard(JSON.parse(lastMove.chessboardAfterWhiteMove));
                        startClock(false);
                    }
                    console.log(game);
                };


                let requestGameInfo = function () {
                    if ($scope.mode === 'playing') {
                        let getGameInfoMessage = {
                            action: "getGameInfo",
                            user: $rootScope.user,
                            gameId: $routeParams.gameId,
                        };
                        console.log("Sending request game info message:" + JSON.stringify(getGameInfoMessage));
                        socket.send(JSON.stringify(getGameInfoMessage));
                    } else if ($scope.mode === 'observing') {
                        $http.get('observe/' + $routeParams.observedPlayer, {}).success(function (game) {
                            //$scope.$evalAsync();
                            observeGame(game);

                        }).error(function (data) {
                            console.log("Retrieval of moves of the observed game failed:" + data.error);
                        });
                    }
                };

                let sendMove = function (element, startPosition,
                                         endPosition, kingInCheck, promotedPiece, annotatedMove) {

                    let moveAction = {
                        action: "move",
                        element: element,
                        oponent: $scope.oponent,
                        startPosition: startPosition,
                        endPosition: endPosition,
                        kingInCheck: kingInCheck,
                        promotedPiece: promotedPiece,
                        castling: $scope.castling,
                        chessboardAfterMove: JSON.stringify(chessboard.squares),
                        gameId: $routeParams.gameId,
                        annotatedMove: annotatedMove,
                        whiteMove: $scope.whiteMove,
                        whiteTime: $scope.whiteTime,
                        blackTime: $scope.blackTime
                    };
                    console.log("sending move to server:");
                    console.log(JSON.stringify(moveAction));
                    socket.send(JSON.stringify(moveAction));


                };

                let initPage = function () {

                    $timeout(function () {

                        user = LoginService.getUserLoggedIn();

                        initialiseChessboard();
                        determineInitialModeOfUsage();
                        requestGameInfo();
                    });
                };

                let determineInitialModeOfUsage = function () {
                    if (typeof $routeParams.observedPlayer !== 'undefined') {
                        $scope.mode = "observing";
                    } else if ($location.url().indexOf("analyzeGame") !== -1) {
                        $scope.mode = "analyzing";
                    } else {
                        $scope.mode = "playing";
                    }
                };

                let init = function () {

                    $timeout(function () {
                        $scope.$apply(function () {
                            initialiseWebSockets();
                            initPage(true);
                            $scope.whitePlayer = true;
                        });
                    });
                };

                init();
            }]);