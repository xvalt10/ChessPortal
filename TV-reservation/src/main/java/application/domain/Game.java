package application.domain;

import java.io.Serializable;
import java.util.*;

public class Game implements Serializable {

    private String gameId;
    private Player whitePlayer;
    private Player blackPlayer;

    private int time;
    private int increment;
    private Set<Player> observers = new HashSet<>();
    private Map<Integer,Move> annotatedMoves = new HashMap<>();

    public Game(){

    }

    public Game(Player whitePlayer, Player blackPlayer, int time, int increment){
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
        this.time = time;
        this.increment = increment;
        this.gameId = UUID.randomUUID().toString();

    }

    public String getGameId() {
        return gameId;
    }

    public Player getWhitePlayer() {
        return whitePlayer;
    }

    public Player getBlackPlayer() {
        return blackPlayer;
    }

    public int getTime() {
        return time;
    }

    public int getIncrement() {
        return increment;
    }

    public Set<Player> getObservers() {
        return observers;
    }

    public Map<Integer, Move> getAnnotatedMoves() {
        return annotatedMoves;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public void setWhitePlayer(Player whitePlayer) {
        this.whitePlayer = whitePlayer;
    }

    public void setBlackPlayer(Player blackPlayer) {
        this.blackPlayer = blackPlayer;
    }

    public void setTime(int time) {
        this.time = time;
    }

    public void setIncrement(int increment) {
        this.increment = increment;
    }

    public void setObservers(Set<Player> observers) {
        this.observers = observers;
    }

    public void setAnnotatedMoves(Map<Integer, Move> annotatedMoves) {
        this.annotatedMoves = annotatedMoves;
    }
}
