import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Router, ActivatedRoute} from '@angular/router'

import {JwtAuthenticationService} from '../../js/services/jwtAuthenticationService'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

	loginForm: FormGroup;
  returnUrl: string;
  submitted = false;
  loading   = false;
  authenticationData={};
  authenticationError: string;

  constructor(private router:Router, private route: ActivatedRoute,private http:HttpClient, private authenticationService:JwtAuthenticationService,  private formBuilder: FormBuilder) { 

  }

  ngOnInit(): void {
	this.loginForm = this.formBuilder.group({
		username: ['', Validators.required],
		password: ['', Validators.required]
	});

	this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/lobby';
  }


	redirectTo(path:string){
		this.router.navigate([path]);
	};

	// convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }
	  
	  
	  login() {

		  this.submitted = true;

		  if (this.loginForm.invalid) {
            return;
        }
		  this.loading = true;

	      this.authenticationService.authenticate({username:this.f.username.value, password:this.f.password.value})
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    if(error.status === 403){
                    this.authenticationError = "Authentication failed - username or password is incorrect."}
                    else{
                      this.authenticationError = "Authentication failed due to a technical error: " + error.message
                    }
                    this.loading = false;
                });
    }
	 
	  
	
	

}
