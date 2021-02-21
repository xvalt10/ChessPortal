import { WebSocketService } from './../../services/websocketService';
import { JwtAuthenticationService } from './../../services/jwtAuthenticationService';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: './new-game-dialog.component.html',
  styleUrls: ['./new-game-dialog.component.css']
})
export class NewGameDialogComponent implements OnInit, OnDestroy {

  constructor(private dialogRef: MatDialogRef<NewGameDialogComponent>,private formBuilder:FormBuilder, private authenticationService:JwtAuthenticationService, private websocketService:WebSocketService) { }
  

  gameTimeForm: FormGroup;
  gameTimeFormSubmitted: boolean;
  gameTimeFormShown : boolean;
  seekOponentInterval: any;
  waitingToBePaired: boolean;

  minRating:number;
  maxRating:number;

  ngOnInit(): void {
    this.gameTimeForm = this.formBuilder.group({
      initialtime: ['', Validators.required],
      incrementpermove: ['', Validators.required],
      minRating:[''],
      maxRating:['']
    });
    this.gameTimeFormSubmitted = false;
    this.gameTimeFormShown = false;
    this.minRating = this.minRating || 1000;
    this.maxRating = this.maxRating || 3000;
    this.waitingToBePaired = false;
  }

  ngOnDestroy(): void {
    clearInterval(this.seekOponentInterval);
  }
 

    // convenience getter for easy access to form fields
    get gameTimeFormFields() { return this.gameTimeForm.controls; }

  seekOponent() {

    this.gameTimeFormSubmitted = true;

    if(this.gameTimeFormSubmitted && this.gameTimeForm.invalid){
      return;
    }
    
    let time = this.gameTimeFormFields.initialtime.value
    let increment = this.gameTimeFormFields.incrementpermove.value;

    this.seekOponentInterval = setInterval(() => this.websocketService.seekNewOponentCommand(time,increment, this.minRating, this.maxRating), 1000);
    
    this.gameTimeFormSubmitted = false;
    this.waitingToBePaired= true;
  };

  close() {
    this.dialogRef.close();
}


}
