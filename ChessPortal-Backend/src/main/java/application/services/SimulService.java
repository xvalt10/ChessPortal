package application.services;

import application.domain.Tournament;
import application.sockets.UserSessionHandler;
import application.tournaments.SimulHandler;
import application.util.GameUtil;
import application.util.TournamentType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/simuls")
public class SimulService {

    SimulHandler simulHandler;
    UserSessionHandler userSessionHandler;

    public SimulService(SimulHandler simulHandler, UserSessionHandler userSessionHandler) {
        this.simulHandler = simulHandler;
        this.userSessionHandler = userSessionHandler;
    }

    @RequestMapping(method = RequestMethod.POST, value = "schedule")
    public List<Tournament> scheduleSimul(@RequestBody Map<String, Object> tournamentDetails) {
        String simulname = String.valueOf(tournamentDetails.get("name"));

        int time = (int) tournamentDetails.get("time");
        int increment = (int) tournamentDetails.get("increment");

        long startDateTimeMillis = (Long)tournamentDetails.get("startDateTime");
        int utcOffsetSeconds = (int)tournamentDetails.get("offsetToUTC");
        int numberOfSimulOponents = (int)tournamentDetails.get("numberOfSimulOponents");

        LocalDateTime utcStartTime = GameUtil.convertMillisToUTCDateTime(startDateTimeMillis, utcOffsetSeconds);

        String organizer = (String)tournamentDetails.get("organizer");

        simulHandler.scheduleNewSimul(simulname,time,increment, utcStartTime, numberOfSimulOponents, userSessionHandler.getPlayerByName(organizer));

        return simulHandler.getTournamentsByState("NOT_STARTED");
    }
}
