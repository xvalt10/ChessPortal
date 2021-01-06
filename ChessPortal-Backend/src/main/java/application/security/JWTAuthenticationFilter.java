package application.security;

import static com.auth0.jwt.algorithms.Algorithm.HMAC512;
import static application.security.SecurityConstants.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.fasterxml.jackson.databind.ObjectMapper;

import application.domain.Player;
import application.domain.PlayerRepository;
import application.domain.Useraccount;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

	private AuthenticationManager authenticationManager;
	private PasswordEncoder passwordEncoder;
	private PlayerRepository playerRepository;

	public JWTAuthenticationFilter(PlayerRepository playerRepository, AuthenticationManager authenticationManager,
			PasswordEncoder passwordEncoder) {
		this.authenticationManager = authenticationManager;
		this.passwordEncoder = passwordEncoder;
		this.playerRepository = playerRepository;
		this.setFilterProcessesUrl("/authenticate");
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res)
			throws AuthenticationException {

		try {
			Useraccount user = new ObjectMapper().readValue(req.getInputStream(), Useraccount.class);
			SimpleGrantedAuthority userrole = new SimpleGrantedAuthority("ROLE_USER");
			List<SimpleGrantedAuthority> userroles = new ArrayList<>();
			userroles.add(userrole);
			return authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword(), userroles));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}

	}

	@Override
	protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException failed) throws IOException, ServletException {
		// TODO Auto-generated method stub
		super.unsuccessfulAuthentication(request, response, failed);
	}

	@Override
	protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain,
			Authentication auth) throws IOException, ServletException {

		String playerName = ((User) auth.getPrincipal()).getUsername();
		Player player = playerRepository.findByUsername(playerName);

		String token = JWT.create().withSubject(playerName)
				.withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME)).sign(HMAC512(SECRET.getBytes()));
		res.addHeader("Access-Control-Expose-Headers", "Authorization,countrycode");	
		res.addHeader(AUTHORIZATION_HEADER, TOKEN_PREFIX + token);
		
		if (player.getCountrycode() != null) {
			res.addHeader("countrycode", player.getCountrycode());
		}
	}
}