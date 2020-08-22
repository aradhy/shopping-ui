import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilterMetaData } from './FilterMetaData';
import { FilterParams } from './filterparams';
import { Observable } from 'rxjs';
import { Category } from '../category/category';
import { CategoryService } from '../category/category.service';



@Injectable({
  providedIn: 'root'
})
export class FilterService {
 
  baseUrlFilter: string = 'http://localhost:8090/filterIntervals';
  public categoryListAll:Category[];
  baseUrl: string = 'http://localhost:8090/category-search';
  baseUrlSearchFilter: string = 'http://localhost:8090/searchFilterInterval';
  httpClient:HttpClient;
  

  constructor(httpClient:HttpClient,private categoryService:CategoryService) { 
   this.httpClient=httpClient;
  }


 
    
  getFilterMetaData(params):Observable<FilterMetaData>
  {

     
  
    
    let filterMetaDataUrl=  this.baseUrlFilter

    return this.httpClient.get<FilterMetaData>(filterMetaDataUrl, {
      params:params});
  }

  getCategory(catId:string,subId:string):Category[]
  {
    let categoryListAll;
    this.categoryService.getCategoriesAll().subscribe(response =>
      {
      
        this.categoryListAll = response;
       
       
      
       
      });
      
    
    return this.categoryListAll;
  }

  
getCategoriesFilters(params): Observable<Category[]>
{
 
    return  this.httpClient.get<Category[]>(this.baseUrl,{
      params:params});
}





getFilterSearchMetaData(search:string,filterParams:FilterParams):Observable<FilterMetaData>
{
  let brandPayLoad=filterParams.brandFilters.join(", ")
  let filterMetaDataUrl=  this.baseUrlSearchFilter+"?search="+search+'&priceFilters='+filterParams.priceFilters.join(", ")+'&weightFilters='+filterParams.weightFilters.join(", ")+'&brandFilters='+brandPayLoad

  return this.httpClient.get<FilterMetaData>(filterMetaDataUrl);
}
}

