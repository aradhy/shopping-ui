import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Category } from './category';
import { SubCategory } from './sub-category';
import { FacebookResponse } from '../user/model/facebook-response';
import { GoogleResponse } from '../user/model/google-response';






@Injectable({
  providedIn: 'root'
})
export class CategoryService {
 
  httpClient:HttpClient;
  baseUrl: string = 'http://localhost:8090/category';
  baseUrlSub: string = 'http://localhost:8090/subcategory/';
  baseUrlAllSub: string = 'http://localhost:8090/sub-category';
  baseCategoryAll:string="http://localhost:8090/category-all";
  
  constructor(httpClient:HttpClient) { this.httpClient=httpClient}


  getCategories(): Observable<Category[]>
  {

return  this.httpClient.get<Category[]>(this.baseUrl);
  }

  getSubCategories(categoryId): Observable<SubCategory[]>
  {
  
return  this.httpClient.get<SubCategory[]>(this.baseUrlSub+categoryId);
  }


 

  getAllSubCategories(): Observable<SubCategory[]>
  {
  
     return  this.httpClient.get<SubCategory[]>(this.baseUrlAllSub);
 
   }


   getCategoriesAll(): Observable<Category[]>
   {
 
 return  this.httpClient.get<Category[]>(this.baseCategoryAll);
   }

  getFaceBookResponse(access_token:string): Observable<FacebookResponse>
  {

  return  this.httpClient.get<FacebookResponse>("https://graph.facebook.com/me?access_token="+access_token+"&fields=name,email");
  }

  getGoogleResponse(access_code:string): Observable<GoogleResponse>
  {

  return  this.httpClient.get<GoogleResponse>("http://localhost:8090/googleUserInfo?code="+access_code);
  }
 
}
