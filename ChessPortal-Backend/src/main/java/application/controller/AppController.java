package application.controller;


import application.domain.Game;
import application.domain.UserAccountRepository;
import application.domain.Useraccount;
import application.sockets.UserSessionHandler;
import application.util.TimeControl;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@RestController
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

    @RequestMapping("/login")
    public boolean login(@RequestBody User user) {
	    UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        return user.getUsername().equals(userDetails.getUsername()) && user.getPassword().equals(userDetails.getPassword());
    }
    
    @RequestMapping(method = RequestMethod.GET, value="games/{gameType}/topRated")
    public Game getTopGameId(@PathVariable String gameType) {
    	return userSessionHandler.findTopRatedGameByType(TimeControl.valueOf(gameType.toUpperCase()));
    	
    
    }

}
