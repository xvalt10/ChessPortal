import { Injectable } from '@angular/core';


import { BASEURL } from '../../js/constants.js'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {config, S3, CognitoIdentityCredentials}  from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class AwsService {
 
  REGION = "eu-central-1"; //e.g., 'us-east-1'
  s3client: S3
  BUCKET = "chessportal-user-avatar-bucket";
  IDENTITYPOOLID = "eu-central-1:2e6b254f-0adf-4df8-a721-979eb2686b76";

  constructor(private http:HttpClient) {
    config.update({
      region: this.REGION,
      credentials: new CognitoIdentityCredentials({
        IdentityPoolId: this.IDENTITYPOOLID
      }),
      
    });
    this.s3client = new S3();

  }

  base64encode(data){
     // let buf = Buffer.from(data);
     // let base64 = buf.toString('base64');
      return btoa(String.fromCharCode.apply(null, data));
  }
  

  async getImageDataFromS3Bucket(username:string){
    return this.s3client.getObject({'Bucket':this.BUCKET,'Key':"avatars/"+username+".png"}).promise();
  }







}
