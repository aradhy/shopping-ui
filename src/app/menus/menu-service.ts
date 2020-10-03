import { Injectable } from '@angular/core';
import { AppService } from '../app-service';
import { ProductSelect } from '../product/productselectview';
import { CookieBucket } from './bucketcookie';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
 

 
  constructor(private appService:AppService) { 

  }


  mergeFromDefaultBucket(userBucketId:string,userBucketString:string,defaultBucketString:string)
  {
      
    if(!this.appService.checkForNullONullString(defaultBucketString) && !this.appService.checkForNullONullString(userBucketString))
    {
       
        return;
    }
    if(this.appService.checkForNullONullString(defaultBucketString) && !(this.appService.checkForNullONullString(userBucketString)))
    {
       
        localStorage.setItem(userBucketId,defaultBucketString)
        return;
    }
    if(!this.appService.checkForNullONullString(defaultBucketString) && (this.appService.checkForNullONullString(userBucketString)))
    {
       
        return;
    }
    var defaultBucket = this.fetchbucketfrombucketstring(defaultBucketString);
   let defaultProductMap = this.fetchmapfrombucketstring(defaultBucket);

    var userBucket = this.fetchbucketfrombucketstring(userBucketString);
    var userProductMap = this.fetchmapfrombucketstring(userBucket);
   

    let mergedMap:Map<string, ProductSelect> = new Map([...Array.from(defaultProductMap.entries()), ...Array.from(userProductMap.entries())]);
   
    userBucket.productSelectViewMap= mergedMap;
    
   
    userBucket.totalItems=defaultBucket.totalItems+userBucket.totalItems
    userBucket.totalPrice=defaultBucket.totalPrice+userBucket.totalPrice
    localStorage.setItem(userBucketId,this.ObjectToJsonString(userBucket))
}

  fetchbucketfrombucketstring(bucketItemString: string): CookieBucket {

    var bucketViewFromString = JSON.parse(bucketItemString);
    return bucketViewFromString;

  }

  fetchmapfrombucketstring(bucketViewFromString: any): Map<string, ProductSelect> {

    var map = new Map<string, ProductSelect>(JSON.parse(bucketViewFromString.productSelectViewMap));
    
    return map;
  }

  ObjectToJsonString(bucketItem: CookieBucket): string {

    var bucketString = JSON.stringify(bucketItem, function (key, value) {

      if (value instanceof (Map)) {
        return JSON.stringify(Array.from(value))
      } else {
        return value;
      }
    });


    return bucketString;

  }
  

}
