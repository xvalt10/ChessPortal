package application.tournaments;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import application.domain.Player;

public class SwissSystemPairingContext implements Iterable<ScoreGroup> {
	
	private static final Logger log = LoggerFactory.getLogger(SwissSystemPairingContext.class);

	int index;
	int roundNumber;
	boolean lastRound;
	
	List<ScoreGroup> scoreGroups;

	List<Player> downfloaters;
	List<Player> backtrackers;
	
	

	public SwissSystemPairingContext(int roundNumber, boolean lastRound, List<ScoreGroup> scoreGroups) {
		super();
		this.roundNumber = roundNumber;
		this.lastRound = lastRound;
		this.scoreGroups = scoreGroups;
		this.backtrackers = new ArrayList<>();
		this.downfloaters = new ArrayList<>();
	}

	@Override
	public Iterator<ScoreGroup> iterator() {
		return new Iterator<ScoreGroup>() {

			@Override
			public boolean hasNext() {
				return index <= scoreGroups.size() - 1;
			}

			@Override
			public ScoreGroup next() {
				
				ScoreGroup scoreGroup = scoreGroups.get(index);
				return scoreGroup;
			}
		};

	}
	
	private ScoreGroup getNextScoreGroup() {
		return scoreGroups.get(index + 1);
	}
	
	public ScoreGroup getPreviousScoreGroup() {
		if (index <= 0) {return null;}else {
		return scoreGroups.get(index - 1);}
	}
	
	public ScoreGroup getCurrentScoreGroup() {
		return scoreGroups.get(index);
	}
	

	public boolean lowestScoreGroup() {
		return this.index == scoreGroups.size() - 1;
	}
	
	public void collapseCurrentScoreGroup() {
		for(Player player : getCurrentScoreGroup().getAllPlayers()) {
			getNextScoreGroup().addPlayer(player);		
		}
		scoreGroups.remove(index);
		index -= 1;
	}

	public void collapsePreviousScoreGroup() {
		for(Player player : getPreviousScoreGroup().getAllPlayers()) {
			getCurrentScoreGroup().addPlayer(player);		
		}
		scoreGroups.remove(index - 1);
		index -= 1;
	}
	
	public boolean canBacktrack(Player player) {
		return !this.backtrackers.contains(player) && index > 0 && getPreviousScoreGroup().canBackTrack(player);
	}
	
	public void backtrackPlayer(Player player) {
		this.backtrackers.add(player);
		
		log.info("Backtracking player {} from score group {} to score group {}", player, getCurrentScoreGroup().score, getPreviousScoreGroup().score);

		
		this.getCurrentScoreGroup().removePlayer(player);
		this.getPreviousScoreGroup().backtrackPlayer(player);
		
		this.index -= 2;
		this.index = this.index < 0 ? 0: this.index;
		
			}
	
	public boolean canDownfloat(Player player) {
		return !this.downfloaters.contains(player) && !lowestScoreGroup();
	}
	
	public void increaseIndex() {
		index+=1;
	}
	
	public void downfloatPlayer(Player player) {
		log.info("Downfloating player {}", player);
		this.downfloaters.add(player);
		this.getCurrentScoreGroup().removePlayer(player);
		this.getNextScoreGroup().addPlayer(player);
	}
}
