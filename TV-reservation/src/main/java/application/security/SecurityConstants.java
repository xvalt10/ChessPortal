package application.security;

import java.time.Duration;

public class SecurityConstants {
	
	public static final long EXPIRATION_TIME = Duration.ofDays(7).toMillis();
	public static final String AUTHORIZATION_HEADER = "Authorization";
	public static final String SECRET = "secretKeyForTokenEncryption";
	public static final String TOKEN_PREFIX = "Bearer:";
	

}
