

isPawnMoveLegal(startPosition,
    endPosition, whitePlayer, kingInCheck) {
    if (Math.abs(startPosition.row
        - endPosition.row) > 2
        || Math.abs(startPosition.column
            - endPosition.column) > 1) {
        return false;
    } else if ((this.whiteMove === true && endPosition.row < startPosition.row) || (this.whiteMove === false && endPosition.row > startPosition.row)) {
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
        let initialPositionOfPiece = this.
            getInitialPositionOfPiece(startPosition.piece);
        return startPosition.row === initialPositionOfPiece.row
            && startPosition.column === initialPositionOfPiece.column;
    } else if (!whitePlayer ? startPosition.row
        - endPosition.row : endPosition.row
        - startPosition.row === 1
        && Math.abs(endPosition.column
            - startPosition.column) === 1) {
        return this.pieceTakenEnPassant(startPosition,
            endPosition, whitePlayer);

    }
};


isBishopMoveLegal(startPosition,
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
                let square = this.findSquare(startPosition.column + x,
                    startPosition.row + x);
                if ((!kingInCheck && !this.isSquareEmpty(square)) ||
                    (kingInCheck && !this.isSquareEmpty(square) && !this.isPieceOnSquare(square, "K"))) {
                    // console.log("Case1");
                    isLegal = false;
                    break;
                }


            }

        } else if (endPosition.row > startPosition.row
            && endPosition.column < startPosition.column) {
            for (let x = 1; x < endPosition.row
                - startPosition.row; x++) {
                let square = this.findSquare(
                    endPosition.column + x,
                    endPosition.row - x);

                if ((!kingInCheck && !this.isSquareEmpty(square)) ||
                    (kingInCheck && !this.isSquareEmpty(square) && !this.isPieceOnSquare(square, "K"))) {

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
                let square = this.findSquare(
                    endPosition.column - x,
                    endPosition.row + x);
                if ((!kingInCheck && !this.isSquareEmpty(square)) ||
                    (kingInCheck && !this.isSquareEmpty(square) && !this.isPieceOnSquare(square, "K"))) {
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
                     let square = this.findSquare(
                         endPosition.column + x,
                         endPosition.row + x)
                     if ((!kingInCheck && !this.isSquareEmpty(square)) ||
                         (kingInCheck && !this.isSquareEmpty(square) && !isPieceOnSquare(square, "K"))) {

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

isRookMoveLegal(startPosition, endPosition, kingInCheck) {
    let isLegal = true;
    if (endPosition.row === startPosition.row) {
        for (let x = 1; x < Math
            .abs(endPosition.column
                - startPosition.column); x++) {
            let square = this.findSquare(endPosition.column > startPosition.column ? startPosition.column
                + x
                : startPosition.column
                - x, startPosition.row);
            if ((!kingInCheck && !this.isSquareEmpty(square)) ||
                (kingInCheck && !this.isSquareEmpty(square) && !this.isPieceOnSquare(square, "K"))) {
                isLegal = false;
            }
        }

    } else if (endPosition.column === startPosition.column) {
        for (let x = 1; x < Math
            .abs(endPosition.row
                - startPosition.row); x++) {
            let square = this.findSquare(startPosition.column,
                endPosition.row > startPosition.row ? startPosition.row
                    + x
                    : startPosition.row - x);
            if ((!kingInCheck && !this.isSquareEmpty(square)) ||
                (kingInCheck && !this.isSquareEmpty(square) && !this.isPieceOnSquare(square, "K"))) {
                isLegal = false;
            }
        }
    } else {
        isLegal = false;
    }
    // console.log("Rook move legal:" + isLegal);
    return isLegal;
}

isKingMoveLegal(startPosition,
    endPosition, whitePlayer, isKingInCheck) {
    if (Math.abs(endPosition.row
        - startPosition.row) <= 1
        && Math.abs(endPosition.column
            - startPosition.column) <= 1
    ) {
        if (startPosition.piece.indexOf('W') !== -1 ? this.isWhitePieceOnSquare(endPosition) : this.isBlackPieceOnSquare(endPosition)) {
            //same coloured piece as the king is on the target square, king move is illegal
            return false;
        } else {
            return !this.canAnyOponentsPieceMoveToSquare(this.chessboard, endPosition.row, endPosition.column, startPosition.piece.indexOf('W') !== -1, true, isKingInCheck);
        }


    } else if (endPosition.row === startPosition.row
        && Math.abs(endPosition.column
            - startPosition.column) === 2
        && endPosition.column === 6) {
        if (whitePlayer === true
            && this.isSquareEmpty(this.findSquare(5, 0))
            && !this.canAnyOponentsPieceMoveToSquare(
                this.chessboard, 0, 5,
                this.whiteMove, null, null)
            && this.isSquareEmpty(this.findSquare(6, 0))
            && !this.canAnyOponentsPieceMoveToSquare(
                this.chessboard, 0, 6,
                this.whiteMove, null, null) && this.hasKingAlreadyMoved("white") === false) {
            console.log("White Short castle");
            this.castling = "0-0";
            return true;
        }

        if (whitePlayer === false
            && endPosition.column === 6
            && this.isSquareEmpty(this.findSquare(5, 7))
            && !this.canAnyOponentsPieceMoveToSquare(
                this.chessboard, 7, 5,
                this.whiteMove, null, null)
            && this.isSquareEmpty(this.findSquare(6, 7))
            && !this.canAnyOponentsPieceMoveToSquare(
                this.chessboard, 7, 6,
                this.whiteMove, null) && this.hasKingAlreadyMoved("black") === false) {
            console.log("Black Short castle");
            this.castling = "0-0";
            return true;
        }


    } else if (endPosition.row === startPosition.row
        && Math.abs(endPosition.column
            - startPosition.column) === 2
        && (endPosition.column === 2)) {
        if (whitePlayer === true
            && this.isSquareEmpty(this.findSquare(2, 0))
            && !this.canAnyOponentsPieceMoveToSquare(
                this.chessboard, 0, 2,
                this.whiteMove, true)
            && this.isSquareEmpty(this.findSquare(3, 0))
            && !this.canAnyOponentsPieceMoveToSquare(
                this.chessboard, 0, 3,
                this.whiteMove, true) && this.hasKingAlreadyMoved("white") === false) {
            console.log("White Long castle");
            this.castling = "0-0-0";
            return true;
        }

        if (whitePlayer === false
            && this.isSquareEmpty(this.findSquare(2, 7))
            && !this.canAnyOponentsPieceMoveToSquare(
                this.chessboard, 7, 2,
                this.whiteMove, true)
            && this.isSquareEmpty(this.findSquare(3, 7))
            && !this.canAnyOponentsPieceMoveToSquare(
                this.chessboard, 7, 3,
                this.whiteMove, true) && this.hasKingAlreadyMoved("black") === false) {

            console.log("Black Long castle");
            this.castling = "0-0-0";
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





pieceTakenEnPassant(startPosition,
    endPosition, whitePlayer) {
    // console.log("En passant  called.");
    console
        .log(startPosition.piece.indexOf("P") !== -1);
    let squaresMovedForward;
    if (this.myMove === true) {
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
        if (this.lastMove.endPosition.piece
            .indexOf("P") !== -1
            && Math
                .abs(this.lastMove.startPosition.row
                    - this.lastMove.endPosition.row) === 2
            && this.lastMove.endPosition.column === endPosition.column) {
            // console.log("En passant.");
            this.enPassant = true;
            return true;
        } else
            return false;

    }
}

canRookMateBePrevented(chessboard,
    kingPosition, checkingPiecePosition,
    whiteMove) {
    let matePreventionPossible = false;
    if (kingPosition.row === checkingPiecePosition.row) {
        for (let x = 1; x < Math
            .abs(kingPosition.column
                - checkingPiecePosition.column); x++) {

            if (this.canAnyOponentsPieceMoveToSquare(
                chessboard,
                kingPosition.row,
                kingPosition.column > checkingPiecePosition.column ? checkingPiecePosition.column
                    + x
                    : checkingPiecePosition.column
                    - x, whiteMove, null, null) === true) {

                matePreventionPossible = true;
                break;
            }

        }

    } else if (kingPosition.column === checkingPiecePosition.column) {
        for (let x = 1; x < Math
            .abs(kingPosition.row
                - checkingPiecePosition.row); x++) {

            if (this.canAnyOponentsPieceMoveToSquare(
                chessboard,
                kingPosition.row > checkingPiecePosition.row ? checkingPiecePosition.row
                    + x
                    : checkingPiecePosition.row
                    - x,
                kingPosition.column, whiteMove, null, null) === true) {

                matePreventionPossible = true;
                break;
            }

        }
    }
    return matePreventionPossible;

}

canBishopMateBePrevented(chessboard,
    kingPosition, checkingPiecePosition,
    whiteMove) {
    console.log("Can bishop mate be prevented?");
    let matePreventionPossible = false;
    if (kingPosition.row > checkingPiecePosition.row
        && kingPosition.column > checkingPiecePosition.column) {
        for (let x = 1; x < kingPosition.row
            - checkingPiecePosition.row; x++) {
            if (this.canAnyOponentsPieceMoveToSquare(
                chessboard,
                checkingPiecePosition.row + x,
                checkingPiecePosition.column
                + x, whiteMove, null, null) === true) {
                console.log("Yes - option 1");
                matePreventionPossible = true;
                break;
            }

        }

    } else if (kingPosition.row > checkingPiecePosition.row
        && kingPosition.column < checkingPiecePosition.column) {
        for (let x = 1; x < this.endPosition.row
            - checkingPiecePosition.row; x++) {
            if (this.canAnyOponentsPieceMoveToSquare(
                chessboard, kingPosition.row
            - x,
                kingPosition.column + x,
                whiteMove, null, null) === true) {
                console.log("Yes - option 2");
                matePreventionPossible = true;
                break;
            }

        }

    } else if (kingPosition.row < checkingPiecePosition.row
        && kingPosition.column > checkingPiecePosition.column) {
        for (let x = 1; x < this.startPosition.row
            - this.endPosition.row; x++) {
            if (this.canAnyOponentsPieceMoveToSquare(
                chessboard, kingPosition.row
            + x,
                kingPosition.column - x,
                whiteMove, null, null) === true) {
                console.log("Yes - option 3");
                matePreventionPossible = true;
                break;
            }

        }

    } else if (kingPosition.row < checkingPiecePosition.row
        && kingPosition.column < checkingPiecePosition.column) {
        for (let x = 1; x < checkingPiecePosition.row
            - this.endPosition.row; x++) {
            if (this.canAnyOponentsPieceMoveToSquare(
                chessboard, kingPosition.row
            + x,
                kingPosition.column + x,
                whiteMove, null, null) === true) {
                console.log("Yes - option 4");
                matePreventionPossible = true;
                break;
            }

        }

    }
    return matePreventionPossible;
}

canMateBePrevented(chessboard,
    kingPosition, checkingPiecePosition,
    whiteMove) {
    let matePreventionPossible = false;

    if (this.canAnyOponentsPieceMoveToSquare(
        chessboard,
        checkingPiecePosition.row,
        checkingPiecePosition.column,
        whiteMove, true)) {

        matePreventionPossible = true;
    } else {

        switch (checkingPiecePosition.piece
            .substr(1, 1)) {
            /*	case "P":
                    if (this.canAnyOponentsPieceMoveToSquare(
                            chessboard,
                            checkingPiecePosition.row,
                            checkingPiecePosition.column,
                            whiteMove)) {

                        matePreventionPossible = true;
                    }
                    break;

                case "N":
                    if (this.canAnyOponentsPieceMoveToSquare(
                            chessboard,
                            checkingPiecePosition.row,
                            checkingPiecePosition.column,
                            whiteMove)) {

                        matePreventionPossible = true;
                    }
                    break;*/

            case "B":
                matePreventionPossible = this.canBishopMateBePrevented(
                    chessboard, kingPosition,
                    checkingPiecePosition, whiteMove);
                break;

            case "R":
                matePreventionPossible = this.canRookMateBePrevented(
                    chessboard, kingPosition,
                    checkingPiecePosition, whiteMove);
                break;

            case "Q":
                if (this.canBishopMateBePrevented(chessboard,
                    kingPosition,
                    checkingPiecePosition, whiteMove) === true
                    || this.canRookMateBePrevented(
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



checkLegalityOfMove(
    startPosition, endPosition, whitePlayer, isKingInCheck) {

    if (typeof endPosition === 'undefined' || startPosition.piece === "empty" ||
        (endPosition.row === startPosition.row && endPosition.column === startPosition.column) ||
        (this.isWhitePieceOnSquare(startPosition) && this.isWhitePieceOnSquare(endPosition)) ||
        (this.isBlackPieceOnSquare(startPosition) && this.isBlackPieceOnSquare(endPosition))
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
                && ((this.whiteMove ? this.isBlackPieceOnSquare(endPosition) : this.isWhitePieceOnSquare(endPosition))
                    || this.isSquareEmpty(endPosition) || isKingInCheck)) {
                return true;
            } else {
                return false;
            }

        case "P":
            return this.isPawnMoveLegal(startPosition,
                endPosition, whitePlayer, isKingInCheck);
        case "K":

            return this.isKingMoveLegal(startPosition,
                endPosition, this.mode === this.chessboardUsageModes.ANALYZING ? this.whiteMove : whitePlayer, null);
        case "B":
            return this.isBishopMoveLegal(startPosition,
                endPosition, isKingInCheck);
        case "R":
            return this.isRookMoveLegal(startPosition,
                endPosition, isKingInCheck);
        case "Q":
            return this.isBishopMoveLegal(startPosition,
                endPosition, isKingInCheck)
                || this.isRookMoveLegal(startPosition,
                    endPosition, isKingInCheck);
        default:
            return true;
    }

};

isSquareEmpty(square) {
    return square.piece === "empty";
}

isBlackPieceOnSquare(square) {
    return square.piece.indexOf("W") === -1 && !this.isSquareEmpty(square);
}

isWhitePieceOnSquare(square) {
    return square.piece.indexOf("W") !== -1 && !this.isSquareEmpty(square);
}

isPieceOnSquare(square, piece) {
    return square.piece.indexOf(piece) !== -1;
}

canAnyOponentsPieceMoveToSquare(
    chessboard, row, column, whiteMove, ignoreKings, isKingInCheck = false) {
    let pieceFound = false;
    let targetSquare = this.findSquare(column, row);
    let colour = whiteMove ? "black" : "white";
    console.log("Can any " + colour + " piece move to square " + this.getSquareAsString(targetSquare) + "?");

    for (let i = 0; i < chessboard.squares.length; i++) {
        let initialSquare = chessboard.squares[i];
        if (ignoreKings === true && initialSquare.piece.indexOf('K') !== -1) {
            continue;
        }
        if (!this.isSquareEmpty(initialSquare)) {
            if ((whiteMove === true && this.isBlackPieceOnSquare(
                initialSquare))
                || (whiteMove === false && this.isWhitePieceOnSquare(
                    initialSquare))) {


                if (this
                    .checkLegalityOfMove(
                        initialSquare,
                        targetSquare,
                        this.whitePlayer, isKingInCheck) === true) {

                    console
                        .log("Following piece can move to target square " + this.getSquareAsString(targetSquare) + ": "
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

isKingMated(chessboard, kingPosition,
    checkingPiecePosition) {

    let x = [1, 1, 1, -1, -1, -1, 0, 0];
    let y = [0, 1, -1, 0, 1, -1, 1, -1];
    let numberOfLegalSquareForKingMove = 8;

    for (let i = 0; i < x.length; i++) {

        let targetSquareIndex = this.findIndexOfSquare(
            kingPosition.column + x[i],
            kingPosition.row + y[i]);
        let targetSquare = chessboard.squares[targetSquareIndex];
        if (typeof targetSquare !== 'undefined' && this.isKingMoveLegal(kingPosition, targetSquare, this.whitePlayer, true) === false) {
            console.log("Retracting square:"
                + this.getSquareAsString(targetSquare));
            numberOfLegalSquareForKingMove--;
        } else if (typeof targetSquare === 'undefined') {
            console.log("Retracting invalid square:"
                + (kingPosition.column + x[i]) + " " + (kingPosition.row + y[i]));
            numberOfLegalSquareForKingMove--;
        } else {
            console
                .log("Valid square for king move:"
                    + this.getSquareAsString(targetSquare));
        }

    }
    if (numberOfLegalSquareForKingMove > 0) {
        // console.log("King not mated:"
        // + numberOfLegalSquareForKingMove);
        return false;
    } else {
        console.log("King has no squares.");
        if (this.canMateBePrevented(chessboard,
            kingPosition,
            checkingPiecePosition, this.whiteMove) === true) {
            console.log("Mate can be prevented.");
            return false;
        }
        // console.log("King is mated.");
        else {
            return true;
        }
    }
}

isKingInCheckOrAndMate(chessboard,
    whiteMove, startPosition, endPosition) {
    let kingPosition = { row: null, column: null, piece: null };
    let kingInCheckOrAndMate = { check: false, mate: false };

    chessboard.squares
        .forEach((square) => {
            if (endPosition.piece.indexOf("W") !== -1 ? square.piece
                .indexOf("BK") !== -1
                : square.piece
                    .indexOf("WK") !== -1) {
                kingPosition.row = square.row;
                kingPosition.column = square.column;
                kingPosition.piece = square.piece;
            }

        });

    if (this.checkLegalityOfMove(
        endPosition,
        kingPosition,
        whiteMove, false) === true) {
        console.log("Checking piece " + endPosition.piece);
        kingInCheckOrAndMate.check = true;
        kingInCheckOrAndMate.mate = this.isKingMated(
            chessboard,
            kingPosition,
            endPosition);
    } else {
        chessboard.squares
            .forEach((square) => {
                if (whiteMove === false ? this.isBlackPieceOnSquare(square)
                    : this.isWhitePieceOnSquare(square)) {
                    if (this.checkLegalityOfMove(
                        square,
                        kingPosition,
                        whiteMove, false) === true) {
                        console.log("Checking piece " + square.piece);
                        kingInCheckOrAndMate.check = true;
                        kingInCheckOrAndMate.mate = this.isKingMated(
                            chessboard,
                            kingPosition,
                            endPosition);
                    }
                }


            });
    }
    return kingInCheckOrAndMate;

}

getSquareAsString(square) {
    return String
        .fromCharCode(97 + square.column)
        + (square.row + 1);
}

findIndexOfSquare(x, y) {
    for (let index = 0; index < this.chessboard.squares.length; index++) {
        if (this.chessboard.squares[index].column === x
            && this.chessboard.squares[index].row === y) {

            return index;
        }
    }
}

findSquare(x, y) {
    return this.chessboard.squares[this.findIndexOfSquare(x, y)];
}

