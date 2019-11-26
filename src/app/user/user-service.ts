import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

import { FacebookResponse } from '../user/model/facebook-response';
import { GoogleResponse } from '../user/model/google-response';
import { TokenResponse } from './model/token-response';






@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  httpClient:HttpClient;
  faceBookUserInfoUrl: string = "https://graph.facebook.com/me?access_token=";

  
  constructor(httpClient:HttpClient) { this.httpClient=httpClient}


 

  getFaceBookResponse(accessToken:string): Observable<FacebookResponse>
  {
    let 
    accessTokenParams={
      'access_token': accessToken,
      'fields':'name,email'
    }
  return  this.httpClient.get<FacebookResponse>(this.faceBookUserInfoUrl,{params:accessTokenParams});
  }

  getGoogleResponse(access_token:string): Observable<GoogleResponse>
  {
    let 
    accessCodeParams={
      'access_token': access_token
    }
  return  this.httpClient.get<GoogleResponse>("https://www.googleapis.com/oauth2/v1/userinfo",{params:accessCodeParams});
  }
 
   socialSignUp(socialResponse)
   {
    this.httpClient.post<TokenResponse>("http://localhost:8080/socialSignUp?provider="+socialResponse.provider,
    socialResponse
      ).subscribe(
        tokenResponse  => {
         console.log(tokenResponse)
          if(tokenResponse.obj!=null )
          {
           
            if(tokenResponse.obj.userName!=null)
            {
             alert("Welcome  "+tokenResponse.obj.userName)  
             localStorage.setItem("customerName",tokenResponse.obj.userName)
            }
            if( tokenResponse.obj.csrfToken!=null )
             localStorage.setItem("X-CSRF-TOKEN",tokenResponse.obj.csrfToken)
             
            return tokenResponse.obj.userName;
          }
        });

   }



}
