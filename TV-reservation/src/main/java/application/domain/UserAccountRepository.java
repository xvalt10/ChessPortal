package application.domain;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<Useraccount, Long> {
	
	Useraccount findByUsername(String username);
	
	List<Useraccount> findTop10ByOrderByElobulletDesc();
	List<Useraccount> findTop10ByOrderByEloblitzDesc();
	List<Useraccount> findTop10ByOrderByElorapidDesc();
	List<Useraccount> findTop10ByOrderByEloclassicalDesc();
}