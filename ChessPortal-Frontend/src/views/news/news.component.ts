import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Router, ActivatedRoute} from '@angular/router'

import {JwtAuthenticationService} from '../../js/services/jwtAuthenticationService'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ClassicEditor from 'ckeditor5-build-classic-simpleupload-imageresize';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
//import * as ClassicEditor from '../../assets/ckeditor5';
//import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import html2canvas from "html2canvas";
import {GameService} from "../../js/services/game.service";
import {PIECES_INITIAL_POSITIONS} from "../../js/constants";
import {HttpService} from "../../js/services/http-service.service";
import {AwsService} from "../../js/services/aws.service";


export interface Article{
    title:string,
    category:string,
    text:string,
    articleId:number
}

@Component({
    selector: 'news-articles',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css']
})

export class NewsComponent implements OnInit {

    @ViewChild('chessboardDiv') chessboardDiv: ElementRef;

    saveArticleForm: FormGroup;

    article= {} as Article;
    saveArticleMessage = null;

    editor = null;
    editorData = "";
    editorConfig = null;
    piecesSvg = "";
    imageUploaded = false;
    imageUrl = null;

    categories = ['World News', 'Slovakia News']
    articles = [];



    showChessboardButtonMessage = 'Hide chessboard'
    columnsToDisplay = ['category', 'title', 'action'];


    gameId = null;

    showChessboard = false;
    showTableWithArticles: boolean;
    showCreateArticleForm = false;
    showArticlesForCategoryView = false;
    showArticleView = false;

    constructor(private gameService:GameService,private router:Router, private route: ActivatedRoute,
                private httpService:HttpService, private authenticationService:JwtAuthenticationService,
                private formBuilder: FormBuilder, private awsService:AwsService) {
        this.saveArticleForm = this.formBuilder.group({


            article_title : [null, Validators.required],
            article_category: [null, Validators.required]


        });

this.showTableWithArticles = false;
this.showCreateArticleForm = false;
this.showChessboard = true;





    //     this.editorConfig = {
    //         height: '700',
    //         toolbar: {
    //             items: [
    //                 'heading',
    //                 '|',
    //                 'bold',
    //                 'italic',
    //                 'link',
    //                 'bulletedList',
    //                 'numberedList',
    //                 '|',
    //                 'outdent',
    //                 'indent',
    //                 '|',
    //                 'blockQuote',
    //                 'insertTable',
    //                 'mediaEmbed',
    //                 'undo',
    //                 'redo',
    //                 'htmlEmbed',
    //                 'imageInsert',
    //                 'imageUpload'
    //             ]
    //         },
    //         language: 'en',
    //         image: {
    //             toolbar: [
    //                 'imageTextAlternative',
    //                 'imageStyle:full',
    //                 'imageStyle:side'
    //             ]
    //         },
    //         table: {
    //             contentToolbar: [
    //                 'tableColumn',
    //                 'tableRow',
    //                 'mergeTableCells'
    //             ]
    //         },
    //         licenseKey: '',
    //
    //
    //     }
    //
    //
    //
     }

    ngOnInit(): void {

        this.gameService.moveSubscriber.subscribe(playedMove => {
            this.piecesSvg = playedMove.piecesSvg;
        });
        this.initializeCKEditor();

        this.showArticlesForCategory(this.categories[0])

    }



    public onChange( { editor }: ChangeEvent ) {




     //

     //   console.log( data );
    }



    addDiagram(){

        let svg = this.chessboardDiv.nativeElement.innerHTML;

        svg = svg.trim()
            .substr(svg.indexOf("<svg"), svg.indexOf("</svg")+"</svg>".length - svg.indexOf("<svg"))
            .trim()
            .replace("<svg", "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" ")
            .replace("</defs></svg>", `${PIECES_INITIAL_POSITIONS}<style>.white{fill:   #c7a47b;} .black{fill: #eedab6}</style></defs></svg>`)

        const imageFile = new File([svg], "diagram2.svg");
        this.awsService.uploadArticleImageToS3Bucket(imageFile).then((data)=>{


           this.editorData = this.editorData + `<img src='${data.Location}'>`
            this.imageUrl = data.Location;
            this.imageUploaded = true;
           // this.editor.config.imageResize.maxHeight = 492;
            this.editor.execute('imageInsert',{source:data.Location});



        });


    }

    saveArticle() {

        this.article.text = this.editor.getData();
        this.article.title = this.saveArticleForm.controls.article_title.value;
        this.article.category = this.saveArticleForm.controls.article_category.value;

        console.log(this.article.text);
        console.log(this.article.title);
        console.log(this.article.category);

        this.httpService.postArticle(JSON.stringify(this.article)).subscribe( (savedArticle:Article) => {
            this.saveArticleMessage = "Article saved successfully.";
            setTimeout(()=>{this.saveArticleMessage = null;},5000)
        });
    }

    showArticlesForCategory(category: string) {

        this.httpService.getArticlesByCategory(category).subscribe((articles:Article[]) =>{
            this.articles = articles;
            this.showArticleView = false;
            this.showArticlesForCategoryView = true;


        });

    }

    private initializeCKEditor(){
        if(!this.editor){
            ClassicEditor
                .create(document.querySelector('#div2'), {})
                .then(editor => {
                    this.editor = editor;
                    this.editor.config.height = '700px';
                    this.editor.config.autoGrow_maxHeight = 600;
                })
                .catch(error => {
                    console.error(error.stack);
                });
        }
    }

    private showAddArticleForm() {
        this.httpService.getAllArticles().subscribe((articles:Article[]) =>setTimeout(()=>this.articles = articles));
        this.showCreateArticleForm = true;
        this.showArticlesForCategoryView = false;
        this.showChessboard = true;
        this.showArticleView = true;
    }

    private showChessboardDiagram(){

        this.showChessboard = !this.showChessboard;
        if(this.showChessboard){this.showChessboardButtonMessage="Hide chessboard"}else{this.showChessboardButtonMessage = "Show chessboard"}
    }

    updateArticle(article:Article) {
        this.article = article;
        this.showAddArticleForm();
        this.editor.setData(this.article.text);
        this.saveArticleForm.controls.article_title.setValue(this.article.title);
        this.saveArticleForm.controls.article_category.setValue(this.article.category);

    }

    clearData() {
        this.editor.setData("");
        this.saveArticleForm.controls.article_title.setValue(null);
        this.saveArticleForm.controls.article_category.setValue(null);
        this.article = {} as Article;
    }
}
