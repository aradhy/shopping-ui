import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Category } from './category';
import { SubCategory } from './sub-category';






@Injectable({
  providedIn: 'root'
})
export class CategoryService {
 
  httpClient:HttpClient;
  baseUrl: string = 'http://localhost:8090/category';
  baseUrlSub: string = 'http://localhost:8090/subcategory?categoryId=';
  constructor(httpClient:HttpClient) { this.httpClient=httpClient}


  getCategories(): Observable<Category[]>
  {

return  this.httpClient.get<Category[]>(this.baseUrl);
  }

  getSubCategories(categoryId): Observable<SubCategory[]>
  {
  
return  this.httpClient.get<SubCategory[]>(this.baseUrlSub+categoryId);
  }
}
