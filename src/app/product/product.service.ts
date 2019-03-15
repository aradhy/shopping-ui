import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl: string = 'http://localhost:8090/product-category';
  httpClient:HttpClient;
  
  constructor(httpClient:HttpClient) { 
this.httpClient=httpClient;
  }

 public getProductByCategory(categoryId: number): Observable<Product[]> {
  

    return this.httpClient.get<Product[]>(this.baseUrl+"/"+categoryId);
  }
}
