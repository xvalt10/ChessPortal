package application.security;

import static application.security.SecurityConstants.AUTHORIZATION_HEADER;
import static application.security.SecurityConstants.SECRET;
import static application.security.SecurityConstants.TOKEN_PREFIX;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

	public JWTAuthorizationFilter(AuthenticationManager authManager) {
		super(authManager);
	}

	@Override
	protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
			throws IOException, ServletException {

		String jwtToken = null;
		String authorizationHeader = req.getHeader(AUTHORIZATION_HEADER);
		
		if (authorizationHeader != null && authorizationHeader.startsWith(TOKEN_PREFIX)) {
			jwtToken = authorizationHeader.replace(TOKEN_PREFIX, "");
		} else if(req.getParameter("token") != null){
			jwtToken = req.getParameter("token").replace(TOKEN_PREFIX, "");
		}		

		if (jwtToken != null) {
			UsernamePasswordAuthenticationToken authentication = getAuthentication(jwtToken);
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}  

		chain.doFilter(req, res);
	}

	private UsernamePasswordAuthenticationToken getAuthentication(String jwtToken) {
		
		UsernamePasswordAuthenticationToken authenticationToken = null;
			String user = JWT
					.require(Algorithm.HMAC512(SECRET.getBytes()))
					.build()
					.verify(jwtToken)
					.getSubject();

			if (user != null) {
				SimpleGrantedAuthority userrole = new SimpleGrantedAuthority("ROLE_USER");
				List<SimpleGrantedAuthority> userroles = new ArrayList<>();
				userroles.add(userrole);
				authenticationToken = new UsernamePasswordAuthenticationToken(user, null, userroles);
			} else {
				System.out.println("User authorization failed.");
			}
		
		return authenticationToken;
	}
}
