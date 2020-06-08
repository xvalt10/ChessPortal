package application.security;

public class SecurityConstants {
	
	public static final long EXPIRATION_TIME = 60 * 60 * 1000;
	public static final String AUTHORIZATION_HEADER = "Authorization";
	public static final String SECRET = "secretKeyForTokenEncryption";
	public static final String TOKEN_PREFIX = "Bearer:";
	

}
