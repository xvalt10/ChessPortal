import { Component, OnInit } from '@angular/core';
import {Article} from "../news/news.component";
import {HttpService} from "../../js/services/http-service.service";
import {CHESSBOARD_USAGE_MODES} from "../../js/constants";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  article:Article;

  constructor(private httpService:HttpService, private route:ActivatedRoute) {
    this.article = {} as Article;
  }

  ngOnInit(): void {


    this.route.params.subscribe(params => {
      const articleId = params['articleId'];
      this.httpService.getArticleById(articleId).subscribe((article:Article) => {
        this.article = article;
      });

      });
  }

}
