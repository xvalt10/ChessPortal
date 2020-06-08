package application.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import application.domain.UserAccountRepository;
import application.domain.Useraccount;
import application.util.GameTimeType;

@RestController
@RequestMapping("/users")
public class UserService {

	private final UserAccountRepository userAccountRepository;

	@Autowired
	UserService(UserAccountRepository userAccountRepository) {

		this.userAccountRepository = userAccountRepository;

	}

	@RequestMapping(method = RequestMethod.GET)
	private List<Useraccount> getAllUserAccounts() {

		return userAccountRepository.findAll();

	}

	@RequestMapping(method = RequestMethod.GET, value = "{username}")
	public Useraccount getUserAccount(@PathVariable String username) {

		return userAccountRepository.findByUsername(username);

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

	@RequestMapping(method = RequestMethod.PUT, value = "{userId}/updateElo/{newElo}")
	public Useraccount updateElo(@PathVariable Long userId, @PathVariable Integer newElo, GameTimeType gameTimeType) {
		Useraccount userAccount = userAccountRepository.findById(userId).orElseThrow(IllegalArgumentException::new);
		switch (gameTimeType) {
			case BLITZ:
				userAccount.setEloblitz(newElo);
				break;
			case BULLET:
				userAccount.setElobullet(newElo);
				break;
			case RAPID:
				userAccount.setElorapid(newElo);
				break;
			case CLASSICAL:
				userAccount.setEloclassical(newElo);
				break;
		}

		return userAccountRepository.save(userAccount);

	}

	@RequestMapping(method = RequestMethod.PUT, value = "{userId}/deposit/{sum}")
	private Useraccount getUserAccount(@PathVariable Long userId, @PathVariable BigDecimal sum) {
		Useraccount userAccount = userAccountRepository.findById(userId).orElseThrow(IllegalArgumentException::new);
		userAccount.setAccountbalance(userAccount.getAccountbalance().add(sum));
		return userAccountRepository.save(userAccount);

	}

}
