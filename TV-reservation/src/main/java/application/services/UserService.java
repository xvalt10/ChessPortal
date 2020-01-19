package application.services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import application.domain.Timeslot;
import application.domain.TimeSlotRepository;
import application.domain.Useraccount;
import application.domain.UserAccountRepository;

@RestController
@RequestMapping("/users")
public class UserService {
	

	private final UserAccountRepository userAccountRepository;
	
	@Autowired
	UserService(UserAccountRepository userAccountRepository ) {

		this.userAccountRepository=userAccountRepository;
		
	}
	
	@RequestMapping(method = RequestMethod.GET)
	private List<Useraccount> getAllUserAccounts() {
		
		return userAccountRepository.findAll();
		
		
	}
	
	
	@RequestMapping(method = RequestMethod.GET, value="{username}")
	public Useraccount getUserAccount(@PathVariable String username) {
		
		return userAccountRepository.findByUsername(username);
		
		
	}
	
	@RequestMapping(method = RequestMethod.PUT, value="{userId}/updateElo/{newElo}")
	public Useraccount updateElo(@PathVariable Long userId, @PathVariable Integer newElo) {
		Useraccount userAccount=userAccountRepository.findById(userId).orElseThrow(IllegalArgumentException::new);
		userAccount.setElo(newElo);
		return userAccountRepository.save(userAccount);
		
		
	}
	
	
	@RequestMapping(method = RequestMethod.PUT, value="{userId}/deposit/{sum}")
	private Useraccount getUserAccount(@PathVariable Long userId, @PathVariable BigDecimal sum) {
		Useraccount userAccount=userAccountRepository.findById(userId).orElseThrow(IllegalArgumentException::new);
		userAccount.setAccountbalance(userAccount.getAccountbalance().add(sum));
		return userAccountRepository.save(userAccount);
		
		
	}

}
