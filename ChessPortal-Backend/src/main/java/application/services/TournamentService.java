package application.services;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.*;

import application.tournaments.SimulHandler;
import application.util.GameUtil;
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
	private SimulHandler simulHandler;

	public TournamentService(TournamentHandler tournamentHandler, SimulHandler simulHandler) {
		this.tournamentHandler = tournamentHandler;
		this.simulHandler = simulHandler;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "type/{tournamentState}")
	public List<Tournament> getTournamentsByState(@PathVariable String tournamentState) {
		List<Tournament> events = new ArrayList<>() ;
		events.addAll(tournamentHandler.getTournamentsByState(tournamentState));
		events.addAll(simulHandler.getTournamentsByState(tournamentState));
		return events;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "schedule")
	public List<Tournament> scheduleTournament(@RequestBody Map<String, Object> tournamentDetails) {
		String tournamentName = String.valueOf(tournamentDetails.get("name"));

		int time = (int) tournamentDetails.get("time");
		int increment = (int) tournamentDetails.get("increment"); 
		TournamentType tournamentType = TournamentType.valueOf(String.valueOf(tournamentDetails.get("type")));
		
		long startDateTimeMillis = (Long)tournamentDetails.get("startDateTime");
		int utcOffsetSeconds = (int)tournamentDetails.get("offsetToUTC");

		LocalDateTime utcStartTime = GameUtil.convertMillisToUTCDateTime(startDateTimeMillis, utcOffsetSeconds);
		
		if(tournamentType==TournamentType.ARENA) {
			long endDateTimeMillis = tournamentDetails.get("startDateTime") != null ? (Long)tournamentDetails.get("startDateTime") : 0;			
			LocalDateTime utcEndTime = GameUtil.convertMillisToUTCDateTime(endDateTimeMillis, utcOffsetSeconds);
			tournamentHandler.createTournament(tournamentName,time,increment, utcStartTime, utcEndTime, tournamentType);
		}else {
				tournamentHandler.createTournament(tournamentName,time,increment, utcStartTime, null, tournamentType);

		}
		return tournamentHandler.getTournamentsByState("NOT_STARTED");
		
		
	}


}
