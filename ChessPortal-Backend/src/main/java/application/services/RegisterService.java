package application.services;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import application.domain.UserAccountRepository;
import application.domain.UserRole;
import application.domain.UserRoleRepository;
import application.domain.Useraccount;

@RestController
@RequestMapping("/register")
public class RegisterService {

	private final UserAccountRepository userAccountRepository;
	private final UserRoleRepository userRoleRepository;

	@Autowired
	RegisterService(UserAccountRepository userAccountRepository, UserRoleRepository userRoleRepository) {
		this.userAccountRepository = userAccountRepository;
		this.userRoleRepository = userRoleRepository;
	}

	@RequestMapping(method = RequestMethod.POST)
	private void registerUser(@RequestParam(value = "username") String username,
			@RequestParam(value = "password") String password) {

		boolean accountAlreadyExists = userAccountRepository.findByUsername(username) != null;
		if (accountAlreadyExists) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already exists");
		} else {
			Useraccount userAccount = new Useraccount();
			userAccount.setUsername(username);
			userAccount.setPassword(encodePassword(password));
			userAccount.setAccountbalance(new BigDecimal(0));
			userAccount.setEloblitz(1500);
			userAccount.setEnabled(true);
			UserRole role = new UserRole();
			role.setUserAccount(userAccount);
			role.setRole("ROLE_USER");
			userAccountRepository.save(userAccount);
			userRoleRepository.save(role);
		}
	}

	public String encodePassword(String password) {

		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		return encoder.encode(password);
	}

}
