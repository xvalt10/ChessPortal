package application.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebMvcSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

 @Autowired 
 UserDetailsService userDetailsService;
 
 @Autowired
 public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {    
  auth.userDetailsService(userDetailsService).passwordEncoder(passwordencoder());;
  
 } 
 
 @Override
 protected void configure(HttpSecurity http) throws Exception {

	 http
     .httpBasic()
     .and()
       .logout().logoutUrl("/logout").deleteCookies("JSESSIONID").logoutSuccessUrl("/index.html").
   and()
     .authorizeRequests()    
       .antMatchers("/index.html","/user","/bower_components/**","/views/registration/*","/views/login/*","views/playingHall/**","/views/admin/admin.js","/views/reservation/**","/js/**","/components/**","/app.css","/app.js",
          "/", "/register","/Reservation/**/**", "/users/*", "/logout","/user","/actions","/images/**" ).permitAll()
          
         .antMatchers("/views/admin/admin.html").hasAnyRole("ADMIN") 
       .anyRequest().authenticated()  
		.and()
		  .csrf().csrfTokenRepository(csrfTokenRepository()).and()
       .addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class);
    
	 
 }
 
 @Bean(name="passwordEncoder")
    public PasswordEncoder passwordencoder(){
     return new BCryptPasswordEncoder();
    }
 
 private CsrfTokenRepository csrfTokenRepository() {
	  HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
	  repository.setHeaderName("X-XSRF-TOKEN");
	  return repository;
	}
}
