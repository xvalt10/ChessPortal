package application.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.jdbc.JdbcDaoImpl;

@Configuration
public class AuthenticationProviderConfig {
 @Bean(name = "dataSource")
 public DriverManagerDataSource dataSource() {
     DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
     driverManagerDataSource.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
     driverManagerDataSource.setUrl("jdbc:sqlserver://localhost:55111;databaseName=ReservationSystemDB");
     driverManagerDataSource.setUsername("sa");
     driverManagerDataSource.setPassword("start123");
     return driverManagerDataSource;
 }
    
    @Bean(name="userDetailsService")
    public UserDetailsService userDetailsService(){
     JdbcDaoImpl jdbcImpl = new JdbcDaoImpl();
     jdbcImpl.setDataSource(dataSource());
     jdbcImpl.setUsersByUsernameQuery("select username,password, enabled from UserAccount where username=?");
     jdbcImpl.setAuthoritiesByUsernameQuery("select b.username, a.role from UserRole a, UserAccount b where b.username=? and a.userid=b.userid");
     return jdbcImpl;
    }
}


