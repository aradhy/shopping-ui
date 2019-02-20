import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl: string = 'http://localhost:8090/product';
  httpClient:HttpClient;
  product:Product;
  constructor(httpClient:HttpClient) { 
this.httpClient=httpClient;
  }

 public getProductByCode(code: number): Observable<Product> {
  

    return this.httpClient.get<Product>(this.baseUrl+"/"+code);
  }
}
