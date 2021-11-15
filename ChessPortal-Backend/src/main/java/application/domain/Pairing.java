package application.domain;

public class Pairing {

    private Player whitePlayer;
    private Player blackPlayer;
    String gameId;
    String gameResult;
    int round;

    public Player getWhitePlayer() {
        return whitePlayer;
    }

    public void setWhitePlayer(Player whitePlayer) {
        this.whitePlayer = whitePlayer;
    }

    public Player getBlackPlayer() {
        return blackPlayer;
    }

    public void setBlackPlayer(Player blackPlayer) {
        this.blackPlayer = blackPlayer;
    }

    public String getGameResult() {
        return gameResult;
    }

    public void setGameResult(String gameResult) {
        this.gameResult = gameResult;
    }

    public int getRound() {
        return round;
    }

    public void setRound(int round) {
        this.round = round;
    }


    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    @Override
    public String toString() {
        return "W: " + (whitePlayer == null ? "BYE" : whitePlayer.getUsername() + " Points: " + whitePlayer.getSession() != null ? whitePlayer.getScore().getPoints() : 0) + " B: " + (blackPlayer == null ? "BYE" : blackPlayer.getUsername() + " Points: " + blackPlayer.getScore() != null ? blackPlayer.getScore().getPoints() : 0);
    }

}
