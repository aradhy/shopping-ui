import { Injectable, Input } from '@angular/core';
import { CookieBucket } from './menus/bucketcookie';
import { ProductSelect } from './product/productselectview';
import { BucketView } from './product/bucketview';
import { BucketModel } from './product/bucketmodel';
import { SharedService } from './sharedservice.service';
import { ProductService } from './product/product.service';

@Injectable({
  providedIn: 'root'
})
export class BucketViewService {

  bucketView:BucketView;
  constructor(private sharedSerevice: SharedService,private productService: ProductService) { }


  removeFromBucket(x:string)
  {
   
    var selectedCount=this.bucketView.productFullInfoBucketMap.get(x).selectedItemCount;
    this.bucketView.totalItemCount=(this.bucketView.totalItemCount)- selectedCount;
    this.bucketView.totalPrice=this.bucketView.totalPrice-(selectedCount*this.bucketView.productFullInfoBucketMap.get(x).price)
    this.bucketView.productFullInfoBucketMap.delete(x);
    this.sharedSerevice.setSet(this.bucketView);
    this.updateCookieBucket(x,0,this.bucketView.totalItemCount,this.bucketView.totalPrice)
  }
   
  addQty(selectedProdAvail:any,selectedItemCount:any)
  {
   
    this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount=this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount+selectedItemCount
    this.bucketView.totalItemCount=this.bucketView.totalItemCount+ 1;
    this.bucketView.totalPrice=this.bucketView.totalPrice+(this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).price)
    this.sharedSerevice.setSet(this.bucketView);
    this.updateCookieBucket(selectedProdAvail,this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount,this.bucketView.totalItemCount,this.bucketView.totalPrice)
  }
  
  subQty(selectedProdAvail:any,selectedItemCount:any)
  {
  
    if(selectedItemCount>0)
    {
      
    this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount= this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount-parseInt(selectedItemCount)
    let updatedCountProdAvail=this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount
    this.bucketView.totalPrice=this.bucketView.totalPrice-(1*this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).price)
   
    this.bucketView.totalItemCount=(this.bucketView.totalItemCount)- selectedItemCount
    if(updatedCountProdAvail==0)
    {
      this.bucketView.productFullInfoBucketMap.delete(selectedProdAvail)
  
    }
   
    this.sharedSerevice.setSet(this.bucketView);
    this.updateCookieBucket(selectedProdAvail,updatedCountProdAvail,this.bucketView.totalItemCount,this.bucketView.totalPrice)
    
    }
    
    
  }
  
  updateCookieBucket(selectedProdAvail:any,selectedItemCount:any,totalItemCount:any,totalPrice:any)
  {
  
    
    if(localStorage.getItem("CookieBucket")=="null")
    {
     this.bucketView.totalItemCount=0;
   }
   else
   { 
      var cookieBucketString= localStorage.getItem("CookieBucket");
      var cookieBucket= this.fetchbucketfrombucketstring(cookieBucketString);
      var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);
    
      cookieBucket.totalItems=totalItemCount;
      cookieBucket.totalPrice=totalPrice;
    
  
    
      if(selectedItemCount==0)
      {
        productSelectViewMap.delete(selectedProdAvail)
  
      }
      else
      {
      
      productSelectViewMap.get(selectedProdAvail).itemCount=parseInt(selectedItemCount)
      }
      
      cookieBucket.productSelectViewMap=productSelectViewMap
     
   }
  
   localStorage.setItem("CookieBucket",this.ObjectToJsonString(cookieBucket));
  }
  
  showCart():BucketView
  {
   
   
    this.bucketView=new BucketView();
    this.bucketView.productFullInfoBucketMap=new Map<string,BucketModel>();
   
    if(localStorage.getItem("CookieBucket")=="null" || localStorage.getItem("CookieBucket")==null)
   {
  
    this.bucketView.totalItemCount=0;
  }
  else
  {
    
     var cookieBucketString= localStorage.getItem("CookieBucket");
     var cookieBucket= this.fetchbucketfrombucketstring(cookieBucketString);
     var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);
     this.bucketView.totalItemCount=cookieBucket.totalItems;
     this.bucketView.totalPrice=cookieBucket.totalPrice
     var keyString=Array.from(productSelectViewMap.keys()).join()
     var productList;
   
     this.productService.bucketProductInfo(keyString).subscribe(response =>
      {
        
        productList = response;
        productList.forEach(product=>{ 
        
         var productSelect= productSelectViewMap.get(product.prodAvailId);
         product.selectedItemCount=productSelect.itemCount;
        
         this.bucketView.productFullInfoBucketMap.set(product.prodAvailId,product);
       
        });
    
      });
  
    
  }
  return this.bucketView;
  }
  
  updateItemCount(selectedProdAvail:string,selectedItemCount:any)
  {
   
    var cookieBucketString= localStorage.getItem("CookieBucket");
    var cookieBucket= this.fetchbucketfrombucketstring(cookieBucketString);
    var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);
   
    
    if(selectedItemCount==null || selectedItemCount=='')
    {
      selectedItemCount=1;
      this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount=1;
    }
   
    this.bucketView.totalItemCount=(this.bucketView.totalItemCount)-(productSelectViewMap.get(selectedProdAvail).itemCount-parseInt(selectedItemCount))
   
    this.bucketView.totalPrice=this.bucketView.totalPrice-(((productSelectViewMap.get(selectedProdAvail).itemCount-parseInt(selectedItemCount))*this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).price))
  
    if(selectedItemCount==0)
    {
   
    this.bucketView.productFullInfoBucketMap.delete(selectedProdAvail);
   
    }
    
    this.sharedSerevice.setSet(this.bucketView);
    this.updateCookieBucket(selectedProdAvail,selectedItemCount,this.bucketView.totalItemCount,this.bucketView.totalPrice)
  
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
