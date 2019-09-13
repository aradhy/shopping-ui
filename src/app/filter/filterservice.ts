import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilterMetaData } from './filterMetaData';
import { FilterParams } from './filterparams';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FilterService {
 
  baseUrlFilter: string = 'http://localhost:8090/filterIntervals/';

  httpClient:HttpClient;
  

  constructor(httpClient:HttpClient) { 
   this.httpClient=httpClient;
  }


 
    
  getFilterMetaData(catId:string,subId:string,filterParams:FilterParams):Observable<FilterMetaData>
  {
    let brandPayLoad=filterParams.brandFilters.join(", ")
  let filterMetaDataUrl=  this.baseUrlFilter+"cat/"+catId+'?subId='+subId+'&priceFilters='+filterParams.priceFilters.join(", ")+'&weightFilters='+filterParams.weightFilters.join(", ")+'&brandFilters='+brandPayLoad

  return this.httpClient.get<FilterMetaData>(filterMetaDataUrl);
  }
}
