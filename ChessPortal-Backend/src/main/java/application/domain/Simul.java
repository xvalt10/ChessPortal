package application.domain;

import application.util.TournamentType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Simul extends Tournament {

    int maxNumberOfOponents;
    Player simulOrganizer;
    List<String> gamesWaitingForMove;
    List<String> gameIds;

    public Simul(String name, int time, int increment, LocalDateTime startDateTime, int maxNumberOfOpponents, Player simulOrganizer){
        this.time = time;
        this.name = name;
        this.increment = increment;
        this.utcStartDateTime = startDateTime;
        this.maxNumberOfOponents = maxNumberOfOpponents;
        this.type = TournamentType.SIMUL;
        this.simulOrganizer = simulOrganizer;
        this.numberOfRounds = 1;
        this.gameIds = new ArrayList<>();
        this.gamesWaitingForMove = new ArrayList<>();
    }

    public int getMaxNumberOfOponents() {
        return maxNumberOfOponents;
    }

    public void setMaxNumberOfOponents(int maxNumberOfOponents) {
        this.maxNumberOfOponents = maxNumberOfOponents;
    }

    public Player getSimulOrganizer() {
        return simulOrganizer;
    }

    public void setSimulOrganizer(Player simulOrganizer) {
        this.simulOrganizer = simulOrganizer;
    }

    public List<String> getGamesWaitingForMove() {
        return gamesWaitingForMove;
    }

    public void setGamesWaitingForMove(List<String> gamesWaitingForMove) {
        this.gamesWaitingForMove = gamesWaitingForMove;
    }

    public List<String> getGameIds() {
        return gameIds;
    }

    public void setGameIds(List<String> gameIds) {
        this.gameIds = gameIds;
    }
}
