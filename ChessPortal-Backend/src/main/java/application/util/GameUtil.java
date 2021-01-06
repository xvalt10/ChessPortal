package application.util;

import application.domain.Player;

public class GameUtil {
	
	public static int getPlayerEloBasedOnGameTime(Player player, TimeControl gameTimeType) {
		int elo = 0;
		switch (gameTimeType) {
		case BULLET:
			elo = player.getElobullet();
			break;
		case BLITZ:
			elo = player.getEloblitz();
			break;
		case RAPID:
			elo = player.getElorapid();
			break;
		case CLASSICAL:
			elo = player.getEloclassical();
			break;
		}

		return elo;
	}

	public static void setPlayerEloBasedOnGameTime(Player player, TimeControl gameTymeType, int elo) {

		switch (gameTymeType) {
		case BULLET:
			player.setElobullet(elo);
			break;
		case BLITZ:
			player.setEloblitz(elo);
			break;
		case RAPID:
			player.setElorapid(elo);
			break;
		case CLASSICAL:
			player.setEloclassical(elo);
			break;
		}

	}

}
