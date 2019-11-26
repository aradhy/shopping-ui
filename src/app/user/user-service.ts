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
  baseUrlSub: string = 'http://localhost:8090/subcategory/';
  baseUrlAllSub: string = 'http://localhost:8090/sub-category';
  baseCategoryAll:string="http://localhost:8090/category-all";
  
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

  getGoogleResponse(accessCode:string): Observable<GoogleResponse>
  {
    let 
    accessCodeParams={
      'code': accessCode
    }
  return  this.httpClient.get<GoogleResponse>("http://localhost:8090/googleUserInfo",{params:accessCodeParams});
  }
 
   socialSignUp(facebookResponse)
   {
    this.httpClient.post<TokenResponse>("http://localhost:8090/socialSignUp?provider="+'facebook',
    facebookResponse
      ).subscribe(
        tokenResponse  => {
         console.log(tokenResponse)
          if(tokenResponse.obj!=null )
          {
            localStorage.setItem("PROVIDER",'facebook')
           
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
