package application.security;

import java.time.Duration;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import application.domain.PlayerRepository;
import application.filters.SimpleCORSFilter;

@Configuration
//@EnableWebMvcSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	UserDetailsService userDetailsService;
	
	@Autowired
	PlayerRepository playerRepository;

	@Autowired
	public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordencoder());

	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {

		http		
		    .csrf()
		        .disable()
		    	//.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
		  
		    .cors()
		    .and()
				.authorizeRequests()
				.antMatchers(
						"/index.html", 
						"/dist/**",					
						"/assets/**/**",
						"/favicon.ico", 
						"/", 
						"/register*",
						"/*.js",
						"/*.js.map", 
						"/*.css",
						"/users/top/**",
						"/users/**/ratinghistory/**",
						"/games/**/**",
						"/articles/**/**",
						"/tournaments/**/**",
						"/simuls/**/**",
						"/tournaments/type/**"
						)


				.permitAll()
				//.antMatchers("/users/top/**").anonymous()
				.antMatchers("/views/admin/admin.html").hasAnyRole("ADMIN")
				.antMatchers("/index.html#/playingHall").hasAnyRole("ADMIN", "USER")
				.antMatchers("/index.html#/lobby").hasAnyRole("ADMIN", "USER")
				.antMatchers("/actions*").hasAnyRole("ADMIN", "USER")
				.antMatchers("/observe/*").hasAnyRole("ADMIN", "USER")
				.antMatchers("/extendtoken/*").hasAnyRole("ADMIN", "USER")
				.antMatchers("/users/**/updateUserProfile").hasAnyRole("ADMIN", "USER")
				.antMatchers("/users/**/uploadImage").hasAnyRole("ADMIN", "USER")
				
				.anyRequest().authenticated().and()
				.logout()
					.logoutUrl("/logout").deleteCookies("JSESSIONID").logoutSuccessUrl("/index.html")
				
			
				.and()
				   //
					//.addFilterBefore(new CsrfHeaderFilter(), CsrfFilter.class)
					.addFilter(new JWTAuthenticationFilter(playerRepository,authenticationManager(), passwordencoder()))
					.addFilter(new JWTAuthorizationFilter(authenticationManager()));
				
		

	}

	@Bean(name = "passwordEncoder")
	public PasswordEncoder passwordencoder() {
		return new BCryptPasswordEncoder();
	}

	private CsrfTokenRepository csrfTokenRepository() {
		CookieCsrfTokenRepository repository = new CookieCsrfTokenRepository();
		//repository.
		repository.setCookiePath("/");
		repository.setCookieName("XSRF-TOKEN");
		//HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
		repository.setHeaderName("X-XSRF-TOKEN");
		return repository;
	}
	
	 @Bean
	  CorsConfigurationSource corsConfigurationSource() {
	    final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.setAllowCredentials(true);
	    configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200","http://localhost:8080", "https://170093a606814b5baeafe88d257409ba.vfs.cloud9.us-east-1.amazonaws.com"));
	    configuration.setAllowedHeaders(Arrays.asList("Origin", "X-Requested-With", "Content-Type", "Accept","X-XSRF-TOKEN","Authorization"));
		configuration.setAllowedMethods(Arrays.asList("GET","POST"));
		configuration.setMaxAge(-1l);
	    source.registerCorsConfiguration("/**", configuration);
	    return source;
	  }
}
