import { Injectable, Input, OnInit } from '@angular/core';
import { CookieBucket } from './menus/bucketcookie';
import { ProductSelect } from './product/productselectview';
import { BucketView } from './product/bucketview';
import { BucketModel } from './product/bucketmodel';
import { SharedService } from './sharedservice.service';
import { ProductService } from './product/product.service';
import { MenuService } from './menus/menu-service';
import { AppService } from './app-service';

@Injectable({
  providedIn: 'root'
})
export class BucketViewService implements OnInit {

  bucketView:BucketView;
  COOKIE_BUCKET_ID: string = "DefaultBucket"
  constructor(private sharedSerevice: SharedService,private productService: ProductService,private appService:AppService) { }
  ngOnInit(): void {
    
   
  }


  removeFromBucket(x:string)
  {
   
    var selectedCount=this.bucketView.productFullInfoBucketMap.get(x).selectedItemCount;
    this.bucketView.totalItemCount=(this.bucketView.totalItemCount)- parseInt(selectedCount);
    this.bucketView.totalPrice=this.bucketView.totalPrice-(parseInt(selectedCount)*this.bucketView.productFullInfoBucketMap.get(x).price)
    this.bucketView.productFullInfoBucketMap.delete(x);
    this.sharedSerevice.setSet(this.bucketView);
    this.updateCookieBucket(x,0,this.bucketView.totalItemCount,this.bucketView.totalPrice)
  }
   
  addQty(selectedProdAvail:any,selectedItemCount:number)
  {
   
    this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount=(parseInt(this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount)+selectedItemCount)+''
    
    this.bucketView.totalItemCount=this.bucketView.totalItemCount+ 1;
    this.bucketView.totalPrice=this.bucketView.totalPrice+(this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).price)
    this.sharedSerevice.setSet(this.bucketView);
    this.updateCookieBucket(selectedProdAvail,this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount,this.bucketView.totalItemCount,this.bucketView.totalPrice)
  }
  
  subQty(selectedProdAvail:any,selectedItemCount:number)
  {
  
    if(selectedItemCount>0)
    {
      
    this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount= (parseInt(this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount)-selectedItemCount)+''
    let updatedCountProdAvail=this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount
    this.bucketView.totalPrice=this.bucketView.totalPrice-(1*this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).price)
   
    this.bucketView.totalItemCount=(this.bucketView.totalItemCount)- selectedItemCount
    if(updatedCountProdAvail=='0')
    {
      this.bucketView.productFullInfoBucketMap.delete(selectedProdAvail)
  
    }
   
    this.sharedSerevice.setSet(this.bucketView);
    this.updateCookieBucket(selectedProdAvail,updatedCountProdAvail,this.bucketView.totalItemCount,this.bucketView.totalPrice)
    
    }
    
    
  }
  
  updateCookieBucket(selectedProdAvail:any,selectedItemCount:any,totalItemCount:any,totalPrice:any)
  {
  
    
 if (this.appService.checkForNullONullString(localStorage.getItem(this.COOKIE_BUCKET_ID)))
   { 
      var cookieBucketString= localStorage.getItem(this.COOKIE_BUCKET_ID);
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
      
      productSelectViewMap.get(selectedProdAvail).itemCount=selectedItemCount
      }
      
      cookieBucket.productSelectViewMap=productSelectViewMap
     
   }
   else{
    this.bucketView.totalItemCount=0;
   }
  
   localStorage.setItem(this.COOKIE_BUCKET_ID,this.ObjectToJsonString(cookieBucket));
  }
  
  showCart(bucketId:string):BucketView
  {
    this.COOKIE_BUCKET_ID=bucketId
    this.bucketView = new BucketView();
    this.bucketView.productFullInfoBucketMap = new Map<string, BucketModel>();


    if (this.appService.checkForNullONullString(localStorage.getItem(this.COOKIE_BUCKET_ID))) {



      var cookieBucketString = localStorage.getItem(this.COOKIE_BUCKET_ID);
      var cookieBucket = this.fetchbucketfrombucketstring(cookieBucketString);
      var productSelectViewMap = this.fetchmapfrombucketstring(cookieBucket);
      this.bucketView.totalItemCount = cookieBucket.totalItems;
      this.bucketView.totalPrice = cookieBucket.totalPrice
      var keyString = Array.from(productSelectViewMap.keys()).join()
      var productList;

      this.productService.bucketProductInfo(keyString).subscribe(response => {

        productList = response;
        productList.forEach(product => {

          var productSelect = productSelectViewMap.get(product.prodAvailId);
          product.selectedItemCount = productSelect.itemCount;

          this.bucketView.productFullInfoBucketMap.set(product.prodAvailId, product);

        });

      });


    }
    else {
      this.bucketView.totalItemCount = 0;
    }
  return this.bucketView;
  }
  
  updateItemCount(selectedProdAvail: string, selectedItemCount: any) {

    var cookieBucketString = localStorage.getItem(this.COOKIE_BUCKET_ID);
    var cookieBucket = this.fetchbucketfrombucketstring(cookieBucketString);
    var productSelectViewMap = this.fetchmapfrombucketstring(cookieBucket);


    if (selectedItemCount == null || selectedItemCount == '') {
      selectedItemCount = 1;
      this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount = '1';
    }

    this.bucketView.totalItemCount = (this.bucketView.totalItemCount) - (parseInt(productSelectViewMap.get(selectedProdAvail).itemCount) - parseInt(selectedItemCount))

    this.bucketView.totalPrice = this.bucketView.totalPrice - (((parseInt(productSelectViewMap.get(selectedProdAvail).itemCount) - parseInt(selectedItemCount)) * this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).price))

    if (selectedItemCount == 0) {

      this.bucketView.productFullInfoBucketMap.delete(selectedProdAvail);

    }

    this.sharedSerevice.setSet(this.bucketView);
    this.updateCookieBucket(selectedProdAvail, selectedItemCount, this.bucketView.totalItemCount, this.bucketView.totalPrice)

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
