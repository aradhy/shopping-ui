import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  baseUrlCategory: string = 'http://localhost:8090/product-category';
  baseUrlSubCategory: string = 'http://localhost:8090/product-subCategoryId';
  baseUrlProduct: string = 'http://localhost:8090/product';
  httpClient:HttpClient;

  
  constructor(httpClient:HttpClient) { 
   this.httpClient=httpClient;
  }

 public getProductByCategory(categoryId: string): Observable<Product[]> {
  

    return this.httpClient.get<Product[]>(this.baseUrlCategory+"/"+categoryId);
  }


  public getProductBySubCategory(subCategoryId: string): Observable<Product[]> {
  

    return this.httpClient.get<Product[]>(this.baseUrlSubCategory+"/"+subCategoryId);
  }

  public productBasedOnCode(code: string): Observable<Product> {
    
    return this.httpClient.get<Product>(this.baseUrlProduct+"/"+code);
  }
}
