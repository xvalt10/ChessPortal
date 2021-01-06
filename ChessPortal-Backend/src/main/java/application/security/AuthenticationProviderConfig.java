package application.security;


import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.jdbc.JdbcDaoImpl;

@Configuration
public class AuthenticationProviderConfig {

    @Autowired
    DataSource dataSource;

 /*@Bean(name = "dataSource")
 public DriverManagerDataSource dataSource() {
     DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
     driverManagerDataSource.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
     driverManagerDataSource.setUrl("jdbc:sqlserver://localhost:55111;databaseName=ReservationSystemDB");
     driverManagerDataSource.setUsername("sa");
     driverManagerDataSource.setPassword("start123");
     return driverManagerDataSource;
 }*/
    
    @Bean(name="userDetailsService")
    public UserDetailsService userDetailsService(){
     JdbcDaoImpl jdbcImpl = new JdbcDaoImpl();
     jdbcImpl.setDataSource(dataSource);
     jdbcImpl.setUsersByUsernameQuery(
    		 "select username,password,enabled " +
             "from user_account " +
             "where username=?");
     jdbcImpl.setAuthoritiesByUsernameQuery(
    		 "select a.username, b.role " +
             "from user_account a, user_role b " +
             "where a.username=? and a.user_id=b.user_id");
     return jdbcImpl;
    }
}


