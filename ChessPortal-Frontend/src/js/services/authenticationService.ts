import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {BASEURL} from '../../js/constants.js'

@Injectable({providedIn: 'root'})
export class AuthenticationService {

    userAuthenticated:boolean;
    authenticatedUser:string;

    
    constructor(private http: HttpClient) { }

    authenticate(credentials, callback) {

      const headers = new HttpHeaders(credentials ? 
        {authorization : "Basic " + btoa(credentials.username + ":" + credentials.password)} : {});

	    this.http.get('user', {headers : headers}).subscribe(authenticationDataFromBackend => {
    
        const username = authenticationDataFromBackend['name'];
	      if (username) {	    	  
	    	   this.getUserFromDB(username).then(function(response){
	    		  const user = authenticationDataFromBackend['data'];
	    		  //user.role = authenticationDataFromBackend.authorities[0].authority;
	    		  console.log("Setting user into session.");
	    		  this.setUserLoggedIn(user);
	    	  });

	        this.userAuthenticated = true;
          this.authenticatedUser = username;
          
	      } else {
	    	  console.log("User not authenticated.");
	        this.userAuthenticated = false;
	      }
	      callback && callback();
      })
      /* .error(function() {
	      $rootScope.authenticated = false;
	      callback && callback();
	    }); */

    };
    
    logout(){
		  this.http.post('logout', {}).subscribe(function() {
			  console.log("Logging user out.");
			  this.removeUserFromSession();
		    this.userAuthenticated = false;
		    this.router.navigate(["/"]);
      })
  /*     .error(function(data) {
		    this.userAuthenticated = false;
		  }); */
		}
	  
		
		userHasRole(role:string){
		  var user = this.getUserLoggedIn();
		  if (user==null){
			  return false;
		  }

			if (user.role===role){
				return true;
			}
			else 
			return false;
		}

    registerUser(username:string, password:string){
        let promise = new Promise((resolve, reject) => {
            let apiURL = `${BASEURL}/register?username=${username}&password=${password}`;
            this.http.post(apiURL,null)
              .toPromise()
              .then(
                resolve => { 
                  //resolve.;
                },
                reject => reject()
              );
          });
          return promise;

    }

    validateUser(username, password){
        let promise = new Promise((resolve, reject) => {
          let apiURL = `${BASEURL}/login?username=${username}&password=${password}`;
            this.http.get(apiURL)
              .toPromise()
              .then(
                resolve => { 
                  //resolve();
                },
                reject => reject()
              );
          });
          return promise;
    }

    getUserFromDB(username){
        let promise = new Promise((resolve, reject) => {
          let apiURL = `${BASEURL}/users/${username}`;
         
            this.http.get(apiURL)
              .toPromise()
              .then(
                resolve => { 
                  //resolve();
                },
                reject => reject()
              );
          });
          return promise;

    }
    getAllUsersFromDB(){
        let promise = new Promise((resolve, reject) => {
          let apiURL = `${BASEURL}/users`;
        
            this.http.get(apiURL)
              .toPromise()
              .then(
                resolve => { 
                  //resolve();
                },
                reject => reject()
              );
          });
          return promise;

    }
    saveUserToSessionStorage(user){
        sessionStorage.setItem("userLoggedIn",JSON.stringify(user));
    }
    getUserLoggedIn(){
        return JSON.parse(sessionStorage.getItem("userLoggedIn"));
    }
    removeUserFromSessionStorage(){
        console.log("Removing user from session storage");
        sessionStorage.removeItem("userLoggedIn");
    }

    
}