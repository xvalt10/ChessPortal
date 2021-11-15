package application.domain;

import java.io.Serializable;
import java.time.LocalDateTime;

public class Move implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 8200739043512976971L;
    int moveNumber;
    String whiteMove;
    String blackMove;
    Integer whiteTime;
    Integer blackTime;
    LocalDateTime whiteMoveTimestamp;
    LocalDateTime blackMoveTimestamp;

    String chessboardAfterWhiteMove;
    String chessboardAfterBlackMove;

    public int getMoveNumber() {
        return moveNumber;
    }

    public void setMoveNumber(int moveNumber) {
        this.moveNumber = moveNumber;
    }

    public String getWhiteMove() {
        return whiteMove;
    }

    public void setWhiteMove(String whiteMove) {
        this.whiteMove = whiteMove;
    }

    public String getBlackMove() {
        return blackMove;
    }

    public void setBlackMove(String blackMove) {
        this.blackMove = blackMove;
    }

    public String getChessboardAfterWhiteMove() {
        return chessboardAfterWhiteMove;
    }

    public void setChessboardAfterWhiteMove(String chessboardAfterWhiteMove) {
        this.chessboardAfterWhiteMove = chessboardAfterWhiteMove;
    }

    public String getChessboardAfterBlackMove() {
        return chessboardAfterBlackMove;
    }

    public void setChessboardAfterBlackMove(String chessboardAfterBlackMove) {
        this.chessboardAfterBlackMove = chessboardAfterBlackMove;
    }

    public Integer getWhiteTime() {
        return whiteTime;
    }

    public void setWhiteTime(Integer whiteTime) {
        this.whiteTime = whiteTime;
    }

    public Integer getBlackTime() {
        return blackTime;
    }

    public void setBlackTime(Integer blackTime) {
        this.blackTime = blackTime;
    }

    public LocalDateTime getWhiteMoveTimestamp() {
        return whiteMoveTimestamp;
    }

    public void setWhiteMoveTimestamp(LocalDateTime whiteMoveTimestamp) {
        this.whiteMoveTimestamp = whiteMoveTimestamp;
    }

    public LocalDateTime getBlackMoveTimestamp() {
        return blackMoveTimestamp;
    }

    public void setBlackMoveTimestamp(LocalDateTime blackMoveTimestamp) {
        this.blackMoveTimestamp = blackMoveTimestamp;
    }
}
