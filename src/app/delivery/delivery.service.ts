import { ProductSelect } from '../product/productselectview';
import { CookieBucket } from '../menus/bucketcookie';
import { BucketView } from '../product/bucketview';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product';
import { Injectable } from '@angular/core';
import { BucketModel } from '../product/bucketmodel';
import { Observable } from 'rxjs';
import { Address } from './address';
import { HttpClient } from 'node_modules/@angular/common/http';
import { AddressResponse } from './address-response';
import { OrderResponse } from './order-response';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService
{
  addUrl: string = 'http://localhost:8080/address';
    bucketView:BucketView;
    productList:Product[];
    private httpClient:HttpClient
    orderSuccess:boolean=false ;
 orderResponse:OrderResponse;
   
constructor(private productService: ProductService, httpClient:HttpClient) 
{
this.httpClient=httpClient;
}



getAddress():Observable<AddressResponse>
{
 
return this.httpClient.get<AddressResponse>(this.addUrl);
}

fetchBucket():Product[]{
  this.bucketView=new BucketView();
  this.bucketView.productFullInfoBucketMap=new Map<string,BucketModel>();
    var cookieBucketString= localStorage.getItem("CookieBucket");
    var cookieBucket= this.fetchbucketfrombucketstring(cookieBucketString);
    var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);

    this.bucketView.totalItemCount=cookieBucket.totalItems;
    this.bucketView.totalPrice=cookieBucket.totalPrice
    var keyString=Array.from(productSelectViewMap.keys()).join()
   
  
       this.productService.bucketProductInfo(keyString).subscribe(response =>
        {
          
          this.productList = response;
          this.productList.forEach(product=>{ 
          
            var productSelect= productSelectViewMap.get(product.prodAvailId);
           product.selectedItemCount=parseInt(productSelect.itemCount);
           
           
          
           });

           let order={

            "orderDetails": "Combo Pack",
            "amount":"400.00",
            "paymentMode":"CC",
            "orderItemList" :this.productList
            
            
            }



            this.httpClient.post<OrderResponse>('http://localhost:8080/order',order).subscribe(orderResponse=>
            {
              this.orderResponse=orderResponse;
              $(".DeliAdd").css({ display: "none" });
              $(".Payment-Options").css({ display: "none" });
              $(".Delivery-Options").css({ display: "none" });
              this.orderSuccess=true
              $('form[name=payuform]').attr('action','https://sandboxsecure.payu.in/_payment');
              $('input[name="hash"]').val(this.orderResponse.hash)
              $('input[name="key"]').val(this.orderResponse.key)
              $('input[name="firstname"]').val(this.orderResponse.firstname)
              $('input[name="phone"]').val(this.orderResponse.phone)
              $('input[name="email"]').val(this.orderResponse.email)
              $('input[name="productinfo"]').val(this.orderResponse.productinfo)
              $('input[name="surl"]').val(this.orderResponse.sUrl)
              $('input[name="txnid"]').val(this.orderResponse.txnId)
              $('input[name="amount"]').val(this.orderResponse.amount)
              $('form[name=payuform]').submit();
              
               
              }
            )
          
         
        });
     return this.productList
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
