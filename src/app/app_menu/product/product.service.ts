import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';
import { Observable, Subject } from 'rxjs';
import { ProductSelect } from './productselectview';
import { BucketModel } from './bucketmodel';
import { CustomerOrder } from '../customerorder';
import { FilterParams } from 'src/app/filter/filterparams';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  baseUrlCategory: string = 'http://localhost:8090/product-category';
  baseUrlSubCategory: string = 'http://localhost:8090/product-subCategoryId';
  baseUrlProduct: string = 'http://localhost:8090/product';
  baseUrlProductName:string="http://localhost:8090/product-name";
  baseUrlBucketProductInfoUrl="http://localhost:8090/bucketproducts";
  addProductForBucketUrl="http://localhost:8090/product/"
  baseUrlProductFilter="http://localhost:8090/productFilter/cat/";
  httpClient:HttpClient;
  
  private selectionFormatState = new Subject<any>();
  constructor(httpClient:HttpClient) { 
   this.httpClient=httpClient;
  }


  setSet(state: any) {
   
    this.selectionFormatState.next(state);
  }

  getState(): Observable<any> {
   
    return this.selectionFormatState.asObservable();
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

  
  public productBasedOnName(name: string): Observable<Product[]> {
   
    return this.httpClient.get<Product[]>(this.baseUrlProductName+"?productName="+name);
  }


  public bucketProductInfo(productIdList:string): Observable<Product[]>
  {
   
    return this.httpClient.get<Product[]>(this.baseUrlBucketProductInfoUrl+"?productIdList="+productIdList);
  }


  getProductByCode(productId:string,productAvailId:string): Observable<BucketModel>
  {
    return this.httpClient.get<BucketModel>(this.addProductForBucketUrl+productId+"/avId/"+productAvailId);
  }

  subCall(order:CustomerOrder):Observable<string>{
   
    return this.httpClient.post<string>("http://localhost:8080/orderStatus",order);
    }
    
  productByFilter(catId:string,subId:string,filterParams:FilterParams): Observable<Product[]>
  {
    let brandPayLoad=filterParams.brandFilters.join(",")
    let pricePayLoad=filterParams.priceFilters.join(",")
    let weightPayLoad=filterParams.weightFilters.join(",")
    let productFilterDataUrl=  this.baseUrlProductFilter+catId+"?subId="+subId+'&priceFilters='+pricePayLoad+'&weightFilters='+weightPayLoad+'&brandFilters='+brandPayLoad

    return this.httpClient.get<Product[]>(productFilterDataUrl)
  }
}
