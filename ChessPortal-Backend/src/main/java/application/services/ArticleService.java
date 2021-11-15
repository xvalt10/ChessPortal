package application.services;

import application.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/articles")
public class ArticleService {

	ArticleRepository articleRepository;

	public ArticleService(ArticleRepository articleRepository){
		this.articleRepository = articleRepository;
	}

	@GetMapping("/category/{category}")
	public ResponseEntity<List<Article>> getArticlesByCategory(@PathVariable String category){
		List<Article> articles = articleRepository.findByCategory(category);
		if(articles == null || articles.isEmpty()){
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.ok(articles);
	}
	@GetMapping("/")
	public ResponseEntity<List<Article>> getAllArticles(){
		List<Article> articles = (List<Article>) articleRepository.findAll();
		if(articles == null){
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.ok(articles);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Article> getArticleById(@PathVariable long id){
		Optional<Article> article = articleRepository.findById(id);

		if(!article.isPresent()){
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.ok(article.get());
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<Article> saveArticle(@RequestBody Article article) {
		
		Article savedArticle = articleRepository.save(article);

		if(savedArticle == null){
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.ok(savedArticle);
	}

}
