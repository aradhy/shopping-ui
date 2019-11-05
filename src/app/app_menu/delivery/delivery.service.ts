import { ProductSelect } from '../product/productselectview';
import { CookieBucket } from '../menus/bucketcookie';
import { BucketView } from '../product/bucketview';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product';
import { Injectable } from '@angular/core';
import { BucketModel } from '../product/bucketmodel';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DeliveryService
{

    bucketView:BucketView;
    productList:Product[];
constructor(private productService: ProductService) 
{

}



fetchBucket():Observable<Product[]>{
  this.bucketView=new BucketView();
  this.bucketView.productFullInfoBucketMap=new Map<string,BucketModel>();
    var cookieBucketString= localStorage.getItem("CookieBucket");
    var cookieBucket= this.fetchbucketfrombucketstring(cookieBucketString);
    var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);

    this.bucketView.totalItemCount=cookieBucket.totalItems;
    this.bucketView.totalPrice=cookieBucket.totalPrice
    var keyString=Array.from(productSelectViewMap.keys()).join()
    var productList;
  
     return this.productService.bucketProductInfo(keyString)
     
}




fetchbucketfrombucketstring(bucketItemString:string):CookieBucket
{

  var bucketViewFromString=JSON.parse(bucketItemString);
  return bucketViewFromString;

}

fetchmapfrombucketstring(bucketViewFromString:any):Map<string,ProductSelect>
{

  var map = new Map<string,ProductSelect>(JSON.parse(bucketViewFromString.productSelectViewMap));
  bucketViewFromString.productSelectViewMap=null;
  return map;
}

ObjectToJsonString(bucketItem:CookieBucket):string
{
  
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
