import { AwsService } from './../../js/services/aws.service';
import { Router } from '@angular/router';
import { HttpService } from './../../js/services/http-service.service';
import { JwtAuthenticationService } from './../../js/services/jwtAuthenticationService';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {countries} from 'countries-list'
//import {Country} from '@angular-material-extensions/select-country';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  games:any;
  showUserStatistics:boolean;
  showGameHistory:boolean;
  showUserProfile:boolean;

  userEmail:string;
  userCountry:string;
  userImageURL:string;
  userImageFile: File;
  userProfileForm: FormGroup;
  userProfileFormSubmitted: boolean;
  userProfileFormLoading: boolean;
  userProfileFormFeedbackMessage: any;
  
  countries: any;
  countryCodes: string[];
  username:string;

  constructor(private formBuilder:FormBuilder,private httpService:HttpService, public authenticationService: JwtAuthenticationService, private router:Router, private awsService:AwsService) {
    this.countries = countries;
    this.countryCodes = Object.keys(this.countries);
    this.userProfileFormFeedbackMessage = {};
    this.userProfileFormFeedbackMessage.type = null;
    this.userProfileFormFeedbackMessage.message = null;
   }

  ngOnInit(): void {
    
    this.username = this.authenticationService.getUsername();
    this.userImageURL = this.authenticationService.getUserData('avatarURL');
    if(!this.userImageURL){
    this.awsService.getImageDataFromS3Bucket(this.username).then(img => {
     this.userImageURL =  `data:image/png;base64,${this.awsService.base64encode(img.Body)}`;
     this.authenticationService.setUserData('avatarURL', this.userImageURL);
    })}

    this.httpService.getUserProfile(this.username).subscribe(data => {
      
      this.userEmail = data['email'];
      this.formControls.email.setValue(this.userEmail);
      this.userCountry = data['countrycode'];
      this.formControls.country.setValue(this.userCountry);
    });

    this.httpService.getGamesByPlayer(this.username).subscribe(data => {       
      this.games = data;
      console.log(this.games);
      this.games.games.forEach(game => {
        game.annotatedMoves = JSON.parse(game.movesJson);
      });
      this.showUserProfile = true
      console.log(this.games);
    });

    this.userProfileForm = this.formBuilder.group({
      country: [''],
      email: ['', Validators.email],
    });

  }

  get formControls() {
    return this.userProfileForm.controls;
  }

  updateUserProfile() {
    this.userProfileFormSubmitted = true;
    if (this.userProfileForm.invalid) {
      return;
    }
    this.userProfileFormLoading = true;

    this.uploadUserImage();
    this.httpService.updateUserProfile(this.username, this.formControls.email.value, this.formControls.country.value).subscribe((res) => {
    
      this.authenticationService.setUserData("countrycode", this.formControls.country.value);
      this.userProfileFormFeedbackMessage.type='info';
      this.userProfileFormFeedbackMessage.message="User profile has been successfully updated.";
      this.userProfileFormLoading = false;
    }, 
    (error)=>{
      this.userProfileFormFeedbackMessage.type='error';
      this.userProfileFormFeedbackMessage.message=error;
      
      this.userProfileFormLoading = false;
    });

  }

  clickGameHistory(){
    this.showGameHistory = true;
    this.showUserStatistics = false;
    this.showUserProfile = false;
  }

  clickUserStatistics(){
    this.showGameHistory = false;
    this.showUserStatistics = true;
    this.showUserProfile = false;
  }

  clickUserProfile(){
    this.showGameHistory = false;
    this.showUserStatistics = false;
    this.showUserProfile = true;
  }

  //game/:gameId/:action

  analyseGame(gameId:string){
    this.router.navigateByUrl(`/game/${gameId}/analyze`)
  }

  uploadUserImage(){

    this.httpService.uploadFileToS3(this.authenticationService.getUsername(),this.userImageFile).subscribe(response => {
      console.log(response);
    }, 
    (error)=>{
      this.userProfileFormFeedbackMessage.type='error';
      this.userProfileFormFeedbackMessage.message=error;
      
      this.userProfileFormLoading = false;
    });
    

  }

  onUserImageChanged(event){

    this.userImageFile = event.target.files[0]
  }

  // onCountrySelected($event: Country){
  //   console.log($event);

  // }

}
