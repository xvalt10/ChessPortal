import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'variation-tree',
  templateUrl: './move-variation-tree.component.html',
  styleUrls: ['./move-variation-tree.component.css']
})
export class MoveVariationTreeComponent implements OnInit {

  @Input() mainVariation: any;
  @Input() moveToHighlight:any;

  @Output() positionToRedraw: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  redrawPosition(fen:string, variationId:number){
    const data = {fen,variationId}
    this.positionToRedraw.emit(data);
  }


}
