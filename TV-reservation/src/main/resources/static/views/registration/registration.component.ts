import { Router } from '@angular/router';
import { JwtAuthenticationService } from './../../js/services/jwtAuthenticationService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  userRegistrationForm: FormGroup;
  submitted = false;
  loading = false;
  userRegistrationData = {};
  backendError:string;



  constructor(private formBuilder: FormBuilder, private authService: JwtAuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.userRegistrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });
  }

  get formControls() {
    return this.userRegistrationForm.controls;
  }

  registerUser() {
    this.submitted = true;
    if (this.userRegistrationForm.invalid) {
      return;
    }
    this.loading = true;

    this.authService.registerUser(this.formControls.username.value, this.formControls.password.value).subscribe((res) => {
      this.userRegistrationForm.reset();
      this.router.navigate(['login']);
    }, 
    (error)=>{
      this.backendError = error;
      this.loading = false;
    });
  }

}
