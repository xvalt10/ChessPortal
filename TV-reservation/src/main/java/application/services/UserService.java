package application.services;

import static application.security.SecurityConstants.EXPIRATION_TIME;
import static application.security.SecurityConstants.SECRET;
import static com.auth0.jwt.algorithms.Algorithm.HMAC512;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import application.domain.Player;
import application.domain.PlayerRepository;
import application.domain.UserAccountRepository;
import application.domain.UserRatingHistory;
import application.domain.UserRatingHistoryRepository;
import application.domain.Useraccount;
import application.util.GameTimeType;

@RestController
@RequestMapping("/users")
public class UserService {

	private final UserAccountRepository userAccountRepository;
	private final PlayerRepository playerRepository;
	private final UserRatingHistoryRepository userRatingHistoryRepository;

	@Autowired
	UserService(UserAccountRepository userAccountRepository, PlayerRepository playerRepository,UserRatingHistoryRepository userRatingHistoryRepository) {

		this.userAccountRepository = userAccountRepository;
		this.playerRepository = playerRepository;
		this.userRatingHistoryRepository = userRatingHistoryRepository;

	}

	@RequestMapping(method = RequestMethod.GET)
	private List<Useraccount> getAllUserAccounts() {

		return userAccountRepository.findAll();

	}

	@RequestMapping(method = RequestMethod.GET, value = "{username}")
	public Player getUserAccount(@PathVariable String username) {

		return playerRepository.findByUsername(username);

	}
	
	@RequestMapping(method = RequestMethod.GET, value = "top/{gameTimetype}")
	public List<Useraccount> getTopRatedPlayers(@PathVariable String gameTimetype){
		
		List<Useraccount> topRatedPlayers = new ArrayList<>();
		switch (GameTimeType.valueOf(gameTimetype.toUpperCase())) {
		case BLITZ:
			topRatedPlayers = userAccountRepository.findTop10ByOrderByEloblitzDesc();
			break;
		case BULLET:
			topRatedPlayers = userAccountRepository.findTop10ByOrderByElobulletDesc();
			break;
		case RAPID:
			topRatedPlayers = userAccountRepository.findTop10ByOrderByElorapidDesc();
			break;
		case CLASSICAL:
			topRatedPlayers = userAccountRepository.findTop10ByOrderByEloclassicalDesc();
			break;
	}
		return topRatedPlayers;
	}

	@RequestMapping(method = RequestMethod.PUT, value = "{username}/updateElo/{newElo}")
	public Player updateElo(@PathVariable String username, @PathVariable Integer newElo, GameTimeType gameTimeType) {
		//Useraccount userAccount = userAccountRepository.findById(userId).orElseThrow(IllegalArgumentException::new);
		Player player = playerRepository.findByUsername(username);
		
		UserRatingHistory userRatingHistory = new UserRatingHistory();
		userRatingHistory.setRatingType(gameTimeType); 
		userRatingHistory.setRatingTimestamp(OffsetDateTime.now());
		userRatingHistory.setUserRating(newElo);
		userRatingHistory.setPlayer(player);		
		userRatingHistoryRepository.save(userRatingHistory);
		
		switch (gameTimeType) {
			case BLITZ:
				player.setEloblitz(newElo);
				break;
			case BULLET:
				player.setElobullet(newElo);
				break;
			case RAPID:
				player.setElorapid(newElo);
				break;
			case CLASSICAL:
				player.setEloclassical(newElo);
				break;
		}

		return playerRepository.save(player);

	}

	@RequestMapping(method = RequestMethod.PUT, value = "{userId}/deposit/{sum}")
	private Useraccount getUserAccount(@PathVariable Long userId, @PathVariable BigDecimal sum) {
		Useraccount userAccount = userAccountRepository.findById(userId).orElseThrow(IllegalArgumentException::new);
		userAccount.setAccountbalance(userAccount.getAccountbalance().add(sum));
		return userAccountRepository.save(userAccount);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "{username}/ratinghistory/{gametype}")
	private List<UserRatingHistory> getUserRatingHistory(@PathVariable String username, @PathVariable String gametype){
		Player player = playerRepository.findByUsername(username);
		return userRatingHistoryRepository.findByPlayerAndRatingTypeAndRatingTimestampAfter(player, GameTimeType.valueOf(gametype.toUpperCase()), OffsetDateTime.now().minusDays(30))
				.stream()
				.sorted(Comparator.comparing(UserRatingHistory::getRatingTimestamp))
				.collect(Collectors.toList());
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "extendtoken/{token}")
	private String extendUserToken(@PathVariable String token){
		String user = JWT
				.require(Algorithm.HMAC512(SECRET.getBytes()))
				.build()
				.verify(token)
				.getSubject();
		if(user != null) {
			System.out.println("Extending token for user "+ user);
			return JWT.create().withSubject(user)
					.withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME)).sign(HMAC512(SECRET.getBytes()));
		}
		else return null;
	}

}
