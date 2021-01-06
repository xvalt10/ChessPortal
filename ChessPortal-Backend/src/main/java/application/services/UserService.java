package application.services;

import static application.security.SecurityConstants.EXPIRATION_TIME;
import static application.security.SecurityConstants.SECRET;
import static com.auth0.jwt.algorithms.Algorithm.HMAC512;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.ByteBuffer;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import application.domain.Player;
import application.domain.PlayerRepository;
import application.domain.UserAccountRepository;
import application.domain.UserRatingHistory;
import application.domain.UserRatingHistoryRepository;
import application.domain.Useraccount;
import application.util.TimeControl;
import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.s3.model.S3Exception;



@RestController
@RequestMapping("/users")
public class UserService {

	private final UserAccountRepository userAccountRepository;
	private final PlayerRepository playerRepository;
	private final UserRatingHistoryRepository userRatingHistoryRepository;

	@Autowired
	UserService(UserAccountRepository userAccountRepository, PlayerRepository playerRepository,UserRatingHistoryRepository userRatingHistoryRepository) {

		this.userAccountRepository = userAccountRepository;
		this.playerRepository = playerRepository;
		this.userRatingHistoryRepository = userRatingHistoryRepository;

	}

	@RequestMapping(method = RequestMethod.GET)
	private List<Useraccount> getAllUserAccounts() {

		return userAccountRepository.findAll();

	}

	@RequestMapping(method = RequestMethod.GET, value = "{username}")
	public Player getUserAccount(@PathVariable String username) {

		return playerRepository.findByUsername(username);

	}
	
	@RequestMapping(method = RequestMethod.GET, value = "top/{gameTimetype}")
	public List<Useraccount> getTopRatedPlayers(@PathVariable String gameTimetype){
		
		List<Useraccount> topRatedPlayers = new ArrayList<>();
		switch (TimeControl.valueOf(gameTimetype.toUpperCase())) {
		case BLITZ:
			topRatedPlayers = userAccountRepository.findTop10ByOrderByEloblitzDesc();
			break;
		case BULLET:
			topRatedPlayers = userAccountRepository.findTop10ByOrderByElobulletDesc();
			break;
		case RAPID:
			topRatedPlayers = userAccountRepository.findTop10ByOrderByElorapidDesc();
			break;
		case CLASSICAL:
			topRatedPlayers = userAccountRepository.findTop10ByOrderByEloclassicalDesc();
			break;
	}
		return topRatedPlayers;
	}

	@RequestMapping(method = RequestMethod.PUT, value = "{username}/updateElo/{newElo}")
	public Player updateElo(@PathVariable String username, @PathVariable Integer newElo, TimeControl gameTimeType) {
		//Useraccount userAccount = userAccountRepository.findById(userId).orElseThrow(IllegalArgumentException::new);
		Player player = playerRepository.findByUsername(username);
		
		UserRatingHistory userRatingHistory = new UserRatingHistory();
		userRatingHistory.setRatingType(gameTimeType); 
		userRatingHistory.setRatingTimestamp(OffsetDateTime.now());
		userRatingHistory.setUserRating(newElo);
		userRatingHistory.setPlayer(player);		
		userRatingHistoryRepository.save(userRatingHistory);
		
		switch (gameTimeType) {
			case BLITZ:
				player.setEloblitz(newElo);
				break;
			case BULLET:
				player.setElobullet(newElo);
				break;
			case RAPID:
				player.setElorapid(newElo);
				break;
			case CLASSICAL:
				player.setEloclassical(newElo);
				break;
		}

		return playerRepository.save(player);

	}

	@RequestMapping(method = RequestMethod.PUT, value = "{userId}/deposit/{sum}")
	private Useraccount getUserAccount(@PathVariable Long userId, @PathVariable BigDecimal sum) {
		Useraccount userAccount = userAccountRepository.findById(userId).orElseThrow(IllegalArgumentException::new);
		userAccount.setAccountbalance(userAccount.getAccountbalance().add(sum));
		return userAccountRepository.save(userAccount);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "{username}/ratinghistory/{gametype}")
	private List<UserRatingHistory> getUserRatingHistory(@PathVariable String username, @PathVariable String gametype){
		Player player = playerRepository.findByUsername(username);
		return userRatingHistoryRepository.findByPlayerAndRatingTypeAndRatingTimestampAfter(player, TimeControl.valueOf(gametype.toUpperCase()), OffsetDateTime.now().minusDays(30))
				.stream()
				.sorted(Comparator.comparing(UserRatingHistory::getRatingTimestamp))
				.collect(Collectors.toList());
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "extendtoken/{token}")
	private String extendUserToken(@PathVariable String token){
		String user = JWT
				.require(Algorithm.HMAC512(SECRET.getBytes()))
				.build()
				.verify(token)
				.getSubject();
		if(user != null) {
			System.out.println("Extending token for user "+ user);
			return JWT.create().withSubject(user)
					.withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME)).sign(HMAC512(SECRET.getBytes()));
		}
		else return null;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "{username}/updateUserProfile")
	private void updateUserProfile(@PathVariable String username, @org.springframework.web.bind.annotation.RequestBody Map<String, Object> jsonObjectKeys)  {
		
		String email = (String)jsonObjectKeys.get("email");
		String countrycode = (String)jsonObjectKeys.get("countrycode");
		Player player = getUserAccount(username);
		player.setEmail(email);
		player.setCountrycode(countrycode);
		playerRepository.save(player);
	}
	
	
	@RequestMapping(method = RequestMethod.POST, value = "{username}/uploadImage")
	private void uploadUserImage(@PathVariable String username, @RequestParam("userImage") MultipartFile file)  {
		
		Region region = Region.EU_CENTRAL_1;
		S3Client s3client = S3Client.builder().region(region).build();
		
		String bucketName = "chessportal-user-avatar-bucket";
		String objectKey = "avatars/"+username+".png";
		
		try {
			PutObjectResponse response = s3client.putObject(PutObjectRequest.builder().bucket(bucketName).key(objectKey)
			        .build(), RequestBody.fromByteBuffer(ByteBuffer.wrap(file.getBytes())));
	
		} catch (S3Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (AwsServiceException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SdkClientException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
