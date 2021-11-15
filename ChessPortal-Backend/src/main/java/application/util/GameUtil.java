package application.util;

import application.domain.Player;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Calendar;
import java.util.Date;

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

	public static LocalDateTime convertMillisToUTCDateTime(long startDateTimeMillis, int utcOffsetSeconds) {
		Date date = new Date(startDateTimeMillis);
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);


		ZoneOffset clientZoneOffset = ZoneOffset.ofTotalSeconds(-1*utcOffsetSeconds);

		OffsetDateTime offsetDateTime= OffsetDateTime.of(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH) + 1, calendar.get(Calendar.DAY_OF_MONTH), calendar.get(Calendar.HOUR_OF_DAY), calendar.get(Calendar.MINUTE), calendar.get(Calendar.SECOND), 0, clientZoneOffset);
		LocalDateTime utcStartTime = LocalDateTime.ofInstant(offsetDateTime.toInstant(), ZoneId.of("UTC"));
		return utcStartTime;
	}

}
