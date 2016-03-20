package application.controller;

import java.security.Principal;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/")
public class AppController {
	
	@RequestMapping(method = RequestMethod.GET)
    public String getIndexPage() {
        return "index";
    }
	
//	 @RequestMapping("/user")
//	  public Principal user(Principal user) {
//	    return user;
//	  }

}
