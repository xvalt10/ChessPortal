package application.services;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
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
	public List<Tournament> scheduleTournament(@RequestBody Map<String, Object> tournamentDetails, TimeZone timezone) {
		String tournamentName = String.valueOf(tournamentDetails.get("name"));

		String[] timecontrol = String.valueOf(tournamentDetails.get("timecontrol")).split("\\+");
		TournamentType tournamentType = TournamentType.valueOf(String.valueOf(tournamentDetails.get("type")));
		long startDateTimeMillis = (Long)tournamentDetails.get("startDateTime");
		
		OffsetDateTime startDateTime =  OffsetDateTime.of(LocalDateTime.ofEpochSecond(startDateTimeMillis / 1000, 0, ZoneOffset.UTC), ZoneOffset.UTC);
		tournamentHandler.createTournament(tournamentName,Integer.parseInt(timecontrol[0]),Integer.parseInt(timecontrol[1]), startDateTime, tournamentType);
		return tournamentHandler.getTournamentsByState("NOT_STARTED");
	}
}
