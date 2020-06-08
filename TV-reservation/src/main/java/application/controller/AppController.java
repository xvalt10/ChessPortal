package application.controller;


import application.domain.UserAccountRepository;
import application.domain.Useraccount;
import application.sockets.UserSessionHandler;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/")
public class AppController {


    UserDetailsService userDetailsService;
    UserSessionHandler userSessionHandler;
    UserAccountRepository userAccountRepository;
    

    public AppController(UserDetailsService userDetailsService, UserSessionHandler userSessionHandler, UserAccountRepository userAccountRepository){
        this.userDetailsService = userDetailsService;
        this.userSessionHandler = userSessionHandler;
        this.userAccountRepository = userAccountRepository;
    }
	
	@RequestMapping(method = RequestMethod.GET)
    public String getIndexPage() {
        return "index";
    }

    @RequestMapping("/login")
    public boolean login(@RequestBody User user) {
	    UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        return user.getUsername().equals(userDetails.getUsername()) && user.getPassword().equals(userDetails.getPassword());
    }
    




}
