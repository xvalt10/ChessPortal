package application.domain;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<Useraccount, Long> {
	
	Useraccount findByUsername(String username);


}
