package application.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class EncodePassword {

 	public static void main(String[] args) {
		BCryptPasswordEncoder encoder=new BCryptPasswordEncoder();
		System.out.println(encoder.encode("hrasko"));
	} 
}
