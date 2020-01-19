package application.controller;

import java.security.Principal;
import java.util.Base64;
import java.util.Collection;

import application.domain.Move;
import application.sockets.UserSessionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/")
public class AppController {


    UserDetailsService userDetailsService;
    UserSessionHandler userSessionHandler;

    public AppController(UserDetailsService userDetailsService, UserSessionHandler userSessionHandler){
        this.userDetailsService = userDetailsService;
        this.userSessionHandler = userSessionHandler;
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
