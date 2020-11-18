package application.domain;

import java.util.List;
import java.util.stream.Collectors;

public class GameRDTO {
	
	List<Game> games;
	long wins;
	long losses;
	long draws;
	
	
	public GameRDTO(List<Game> games, String username) {
		this.games = games.stream().filter(game ->game.getGameresult() != null).collect(Collectors.toList());
		wins = this.games.stream()
		     .filter(game -> ((game.getGameresult().startsWith("1-0") && game.getWhitePlayer().getUsername().equals(username)) || 
		    		 (game.getGameresult().startsWith("0-1") && game.getBlackPlayer().getUsername().equals(username)))).count();
		
		losses = this.games.stream()
			     .filter(game -> ((game.getGameresult().startsWith("0-1") && game.getWhitePlayer().getUsername().equals(username)) || 
			    		 (game.getGameresult().startsWith("1-0") && game.getBlackPlayer().getUsername().equals(username)))).count();
		
		draws = this.games.stream().filter(game ->  (game.getGameresult().equals("1/2 - 1/2"))).count(); 
	}


	public List<Game> getGames() {
		return games;
	}


	public void setGames(List<Game> games) {
		this.games = games;
	}


	public long getWins() {
		return wins;
	}


	public void setWins(long wins) {
		this.wins = wins;
	}


	public long getLosses() {
		return losses;
	}


	public void setLosses(long losses) {
		this.losses = losses;
	}


	public long getDraws() {
		return draws;
	}


	public void setDraws(long draws) {
		this.draws = draws;
	}
	
	

}
