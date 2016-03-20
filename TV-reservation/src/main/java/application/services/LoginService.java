package application.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


import application.domain.UserAccountRepository;

	@RestController
	@RequestMapping("/login")
	class LoginService{

		private final UserAccountRepository userAccountRepository;
		
		@Autowired
		LoginService(UserAccountRepository userAccountRepository) {
			this.userAccountRepository = userAccountRepository;
			
		}

		@RequestMapping(method = RequestMethod.GET)
		private void validateUser() {
			
					
					
		}

		@ResponseStatus(HttpStatus.NOT_FOUND)
		class LoginFailedException extends RuntimeException {

			private static final long serialVersionUID = 1L;

			public LoginFailedException() {
				super("Wrong username or password");
			}
		}
		
		

	
}
