package application;

import java.security.Principal;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.annotation.Order;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


import application.domain.UserAccountRepository;

@EnableJpaRepositories
@SpringBootApplication
@EnableScheduling
@RestController
public class Application {
	
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}


	 @RequestMapping("/user")
	  public Principal user(Principal user) {
	    return user;
	  }
	 
//	 @RequestMapping(value="/logout", method = RequestMethod.POST)
//	 public void logoutPage (HttpServletRequest request, HttpServletResponse response) {
//	     Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//	     if (auth != null){    
//	         new SecurityContextLogoutHandler().logout(request, response, auth);
//	         SecurityContextHolder.getContext().setAuthentication(null);
//	     }
//	     //You can redirect wherever you want, but generally it's a good practice to show login screen again.
//	 }
	  
	  
	

}
