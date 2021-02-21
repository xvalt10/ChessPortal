package application.services;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import application.domain.Tournament;
import application.tournaments.TournamentHandler;
import application.util.TournamentType;

@RestController
@RequestMapping("/tournaments")
public class TournamentService {
	
	private TournamentHandler tournamentHandler;

	public TournamentService(TournamentHandler tournamentHandler) {
		this.tournamentHandler = tournamentHandler;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "type/{tournamentState}")
	public List<Tournament> getTournamentsByState(@PathVariable String tournamentState) {
		return tournamentHandler.getTournamentsByState(tournamentState);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "schedule")
	public List<Tournament> scheduleTournament(@RequestBody Map<String, Object> tournamentDetails) {
		String tournamentName = String.valueOf(tournamentDetails.get("name"));

		int time = (int) tournamentDetails.get("time");
		int increment = (int) tournamentDetails.get("increment"); 
		TournamentType tournamentType = TournamentType.valueOf(String.valueOf(tournamentDetails.get("type")));
		
		long startDateTimeMillis = (Long)tournamentDetails.get("startDateTime");
		Date date = new Date(startDateTimeMillis);
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		
		int offSetSeconds = (int)tournamentDetails.get("offsetToUTC"); 
		ZoneOffset clientZoneOffset = ZoneOffset.ofTotalSeconds(-1*offSetSeconds);
		
		
		OffsetDateTime offsetDateTime= OffsetDateTime.of(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH) + 1, calendar.get(Calendar.DAY_OF_MONTH), calendar.get(Calendar.HOUR_OF_DAY), calendar.get(Calendar.MINUTE), 0, 0, clientZoneOffset);
		
		LocalDateTime utcStartTime = LocalDateTime.ofInstant(offsetDateTime.toInstant(), ZoneId.of("UTC"));
		
		tournamentHandler.createTournament(tournamentName,time,increment, utcStartTime, tournamentType);
		return tournamentHandler.getTournamentsByState("NOT_STARTED");
		
		
	}
}
