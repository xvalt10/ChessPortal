package application.domain;

import java.io.Serializable;

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
}
