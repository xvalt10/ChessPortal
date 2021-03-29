import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Router, ActivatedRoute} from '@angular/router'

import {JwtAuthenticationService} from '../../js/services/jwtAuthenticationService'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import * as ClassicEditor from '../../assets/ckeditor5';
//import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import html2canvas from "html2canvas";
import {GameService} from "../../js/services/game.service";
import {PIECES_INITIAL_POSITIONS} from "../../js/constants";




@Component({
    selector: 'news-articles',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css']
})

export class NewsComponent implements OnInit {

    @ViewChild('chessboardDiv') chessboardDiv: ElementRef;
    categoryForm: FormGroup;
    catContent = '';
    editor = null;
    editorData = "";
    editorConfig = null;
    piecesSvg = "";


    gameId = null;

    constructor(private gameService:GameService,private router:Router, private route: ActivatedRoute,private http:HttpClient, private authenticationService:JwtAuthenticationService,  private formBuilder: FormBuilder) {
        this.categoryForm = this.formBuilder.group({

            catContent : [null, Validators.required]
        });

        this.editor = ClassicEditor;
        this.editorConfig = {

            toolbar: {
                items: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'outdent',
                    'indent',
                    '|',
                    'blockQuote',
                    'insertTable',
                    'mediaEmbed',
                    'undo',
                    'redo',
                    'htmlEmbed',
                    'imageInsert',
                    'imageUpload'
                ]
            },
            language: 'en',
            image: {
                toolbar: [
                    'imageTextAlternative',
                    'imageStyle:full',
                    'imageStyle:side'
                ]
            },
            table: {
                contentToolbar: [
                    'tableColumn',
                    'tableRow',
                    'mergeTableCells'
                ]
            },
            licenseKey: '',


        }



    }

    ngOnInit(): void {
        this.gameService.moveSubscriber.subscribe(playedMove => {
            alert(playedMove.piecesSvg);
            this.piecesSvg = playedMove.piecesSvg;
        });
    }



    addDiagram(){

        let svg = this.chessboardDiv.nativeElement.innerHTML;
        svg = svg.trim()

           // .replaceAll("xlink:href", "href")
        svg = svg.substr(svg.indexOf("<svg"), svg.indexOf("</svg")+"</svg>".length - svg.indexOf("<svg"))
            .trim()
            .replace("<svg", "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" ")
            .replace("</defs></svg>", `${PIECES_INITIAL_POSITIONS}<style>.white{fill:   #c7a47b;} .black{fill: #eedab6}</style></defs></svg>`)


     //   let svg =`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" class="cm-chessboard default"><g class="board input-enabled"><rect width="493" height="493" class="border"></rect><rect x="1.540625" y="430.21953125" width="61.23984375" height="61.23984375" class="square black" data-index="0"></rect><rect x="62.78046875" y="430.21953125" width="61.23984375" height="61.23984375" class="square white" data-index="1"></rect><rect x="124.0203125" y="430.21953125" width="61.23984375" height="61.23984375" class="square black" data-index="2"></rect><rect x="185.26015625" y="430.21953125" width="61.23984375" height="61.23984375" class="square white" data-index="3"></rect><rect x="246.5" y="430.21953125" width="61.23984375" height="61.23984375" class="square black" data-index="4"></rect><rect x="307.73984375" y="430.21953125" width="61.23984375" height="61.23984375" class="square white" data-index="5"></rect><rect x="368.97968749999995" y="430.21953125" width="61.23984375" height="61.23984375" class="square black" data-index="6"></rect><rect x="430.21953125" y="430.21953125" width="61.23984375" height="61.23984375" class="square white" data-index="7"></rect></g></svg>`
        //this.editorData = svg;

        const blob = new Blob([svg], {type: 'image/svg+xml'});

        const url = URL.createObjectURL(blob);
        this.editorData = `<div style="width:492px">fdafafafasdf<img class="diagram" src="${url}" style="width:492px"/><div>`;
        const image = document.createElement('img');

        image.addEventListener('load', () => URL.revokeObjectURL(url), {once: true});
        image.src = url;
        image.width = 492;
        image.height = 492;

        document.getElementById('div1').append(image);

        /*html2canvas(document.querySelector("#chessboardDiv")).then(canvas => {
            document.body.appendChild(canvas)
        });*/
    }

    onFormSubmit() {
        alert(this.categoryForm.controls.catContent.value);
    }




}
