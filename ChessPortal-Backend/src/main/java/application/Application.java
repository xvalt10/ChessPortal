package application;

import java.security.Principal;

import application.domain.Game;
import application.domain.GameRepository;
import application.services.GameService;
import application.sockets.UserSessionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import org.springframework.scheduling.annotation.EnableScheduling;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

@EnableJpaRepositories
@SpringBootApplication
//@EnableScheduling
@RestController
public class Application {

	@Autowired
	UserSessionHandler userSessionHandler;
	
	@Autowired
	GameRepository gameRepository;

	public static void main(String[] args) {

		SpringApplication.run(Application.class, args);
	}

	@RequestMapping("/user")
	public Principal user(Principal user) {
		return user;
	}

	@RequestMapping("/observe/{gameId}")
	public Game observeGame(@PathVariable String gameId, Principal principal) {
		String observer = principal.getName();
		

		Game game = userSessionHandler.findGameByGameId(gameId);
				
		if (game != null ) {
			System.out.println("Adding observer " + observer + " to game " + gameId);
			userSessionHandler.addObserverToGame(game, observer);
		} else {
			game = gameRepository.findById(gameId).orElse(null);
		}
		
		return game;
	}

	@RequestMapping("/observe/{observedPlayer}/cancel")
	public void stopObservingGameGame(@PathVariable String observedPlayer, Principal principal) {
		Game game = userSessionHandler.findGameByPlayer(observedPlayer);
		if (game != null) {
			game.getObservers().removeIf(player -> player.getUsername().equals(principal.getName()));
		}
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
