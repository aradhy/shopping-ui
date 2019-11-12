import { Component, OnInit, EventEmitter, Input, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product';
import { Router,ActivatedRoute, NavigationStart } from '@angular/router';
import {Output} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductSelect } from './productselectview';

import { CookieService } from 'ngx-cookie-service';
import { CookieBucket } from '../menus/bucketcookie';
import { Subscription } from 'rxjs';
import { SharedService } from '../sharedservice.service';
import { ProductAvail } from './productavail';
import { BucketView } from './bucketview';
import { BucketModel } from './bucketmodel';

import { FilterComponent } from 'src/app/filter/filter.component';
import { FilterParams } from 'src/app/filter/filterparams';
import { SearchProduct } from './search-product';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers:[ProductService,CookieService ]
})



export class ProductComponent implements OnInit {
 
 
@Output() bucketViewEmitter: EventEmitter<BucketView> = new EventEmitter();  


 public productList:Product[];
 public productSearchList:SearchProduct[];
 public name:String;
 url:string;
 id:string;
 bucketView:BucketView;
 catId:string;
 subId:string;
 search:string;

 @ViewChild(FilterComponent)
    private filterComponent: FilterComponent;

 @Input() filterParams:FilterParams=new FilterParams();

 private subscription: Subscription;

 

 constructor(private productService: ProductService,private activatedRoute:ActivatedRoute,private router:Router,private cookieService:CookieService ,private sharedService:SharedService) {
 
 
  this.subscription= this.sharedService.getState().subscribe(bucketView=>{
   
    this.bucketView=bucketView
   
  });

}




ngOnInit() {

this.showCart();

if (this.router.url.includes('sub'))
{

  this.activatedRoute.queryParams.subscribe(routeParams => {
    this.catId=routeParams.catId
    this.subId=routeParams.subId
    
    this.filterComponent.setCategorySubCategory(this.catId,this.subId);
    this.filterComponent.getFilterMetaData(this.catId,this.subId)
 
    this.productBasedOnSubCategory();
   });
  
}
else if(this.router.url.includes('cat')) 
{

  this.activatedRoute.queryParams.subscribe(routeParams => {
    this.catId=routeParams.catId
    this.subId=null
  this.filterComponent.setCategorySubCategory(this.catId,this.subId);
  this.productBasedOnCategory();

  this.filterComponent.getFilterMetaData(this.catId,this.subId)
 
})

}
else{

    this.activatedRoute.queryParams.subscribe(queryParams => {
    this.search=queryParams['search']
    
    let 
      params={
        'search': this.search
      }
    this.productBasedSearch (params);
    this.filterComponent.getFilterMetaDataSearch(this.search,this.filterParams)
  
    this.filterComponent.searchFilterUrl(params);
   })
 }
  
}
 resetFilter(event)
 {

   this.filterComponent.resetAll();
  
 }
 
 fetchFilters(event) { 

   this. filterParams=event
   let brandPayLoad=this.filterParams.brandFilters.join(",")
    let pricePayLoad=this.filterParams.priceFilters.join(",")
    let weightPayLoad=this.filterParams.weightFilters.join(",")

let 
  params={
    'catId': this.catId,
    'subId': this.subId,
    'search':this.search,
    'brandFilters':brandPayLoad,
    'priceFilters':pricePayLoad,
    'weightFilters':weightPayLoad
  }
  if(this.catId!=null && this.subId!=null)
  {
 this.productService.productByFilter(params).subscribe(response =>
  {
   
    this.productSearchList = response;
    if(this.productSearchList==[])
    {
      this.filterComponent.getFilterMetaData(this.catId,this.subId)
    }
    console.log('Products based on Category From DB')
    this.productSearchList = response;
    this.productSearchList.forEach(productSearch=>{
       
      productSearch.prod.selectedItemCount=1;
      productSearch.prod.itemCountList=[1,2,3,4];
       
      productSearch.prod.selectedProductAvail= productSearch.prod.productAvailList[0];
      }  
    )
    return this.productSearchList;

      }
      );
    }
    if(this.search!=null)
    {
     
      this.productBasedSearch(params)

    }

 } 
 



  
   productBasedOnCategory()
  {

  

   let 
     params={
       'catId': this.catId
     }
   
 
   this.productService.productByFilter(params).subscribe(response =>
      {
       
        this.productSearchList = response;
        console.log('Products based on Category From DB')

          this.productSearchList.forEach(productSearch=>{
           
            productSearch.prod.selectedItemCount=1;
            productSearch.prod.itemCountList=[1,2,3,4];
           
            productSearch.prod.selectedProductAvail=  productSearch.prod.productAvailList[0];
          }  
        )
        return this.productList;
    
          });
         
       
  }

  productBasedOnSubCategory()
  {

    
    let 
      params={
        'catId': this.catId,
        'subId': this.subId
      }
    
   
   
    this.productService.productByFilter(params).subscribe(response =>
      {
       
        this.productSearchList = response;
        console.log('Products based on Category From DB')

          this.productSearchList.forEach(productSearch=>{
            productSearch.prod.selectedItemCount=1;
            productSearch.prod.itemCountList=[1,2,3,4];
            productSearch.prod.selectedProductAvail=  productSearch.prod.productAvailList[0];
          }  
        )
        return this.productList;
    
          });
      
   
  
  }

  productBasedSearch (params)
  {

 
    this.productService.productBasedOnName(params).subscribe(response =>
      {
       
       
        console.log(this.productList)
        this.productSearchList = response;
        console.log('Products based on Category From DB')

          this.productSearchList.forEach(productSearch=>{
           
            productSearch.prod.selectedProductAvail=  productSearch.prod.productAvailList[0];
          }  
        )
       
      });
      
   
  
  }
 
addToCart(productId:any,selectedProductAvail:any,itemCount:any)
  {

  if(itemCount==null &&  selectedProductAvail==null)
  {
    return ;
  }
  if(this.bucketView==null)
    {
     
      this.bucketView=new BucketView();
      this.bucketView.productFullInfoBucketMap=new Map<string,BucketModel>();
      

    }
 
   if(localStorage.getItem("CookieBucket")=="null" || localStorage.getItem("CookieBucket")==null)
   {

     var cookieBucket=new CookieBucket();
     var  productSelectItemNew=new ProductSelect(productId,selectedProductAvail.id,itemCount);
     cookieBucket.getProductSelectMapView().set(selectedProductAvail.id,productSelectItemNew);
     this.getTheFullViewMap(productId,selectedProductAvail,itemCount,cookieBucket);
    
   
      
  }
  else
  {
     var bucketItemString= localStorage.getItem("CookieBucket");
     var cookieBucket= this.fetchbucketfrombucketstring(bucketItemString);
     var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);
     
    if(productSelectViewMap.has(selectedProductAvail.id))
    {

      productSelectViewMap.get(selectedProductAvail.id).itemCount=(productSelectViewMap.get(selectedProductAvail.id).itemCount)+parseInt(itemCount)
      cookieBucket.productSelectViewMap=productSelectViewMap;
      this.getTheFullViewMap(productId,selectedProductAvail,itemCount,cookieBucket);
      localStorage.setItem("CookieBucket",this.ObjectToJsonString(cookieBucket));
   
    }
    else
    {
     
      var productSelect=new ProductSelect(productId,selectedProductAvail.id,itemCount);
      productSelectViewMap.set(selectedProductAvail.id,productSelect)
      cookieBucket.productSelectViewMap=productSelectViewMap;
      this.getTheFullViewMap(productId,selectedProductAvail,itemCount,cookieBucket);
      
     
    }
  
    }
  
    

      
  

     
  }
 


  removeFromCart(selectProdAvail:any,itemCount:any)
  {
 
 
if(!(localStorage.getItem("CookieBucket")=="null"))
 {

     var bucketItemString= localStorage.getItem("CookieBucket");
     var cookieBucket:CookieBucket=this.fetchbucketfrombucketstring(bucketItemString);
     var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);
  if(productSelectViewMap.has(selectProdAvail.id) && productSelectViewMap.get(selectProdAvail.id).itemCount>0 && cookieBucket.totalItems>=itemCount)
  {
    this.bucketView.productFullInfoBucketMap.get(selectProdAvail.id).selectedItemCount=this.bucketView.productFullInfoBucketMap.get(selectProdAvail.id).selectedItemCount-parseInt(itemCount);
    this.bucketView.totalPrice=this.bucketView.totalPrice-(parseInt(itemCount)*this.bucketView.productFullInfoBucketMap.get(selectProdAvail.id).price)
    productSelectViewMap.get(selectProdAvail.id).itemCount=productSelectViewMap.get(selectProdAvail.id).itemCount-parseInt(itemCount)
  
    cookieBucket.totalItems= cookieBucket.totalItems-parseInt(itemCount)
    this.bucketView.totalItemCount= this.bucketView.totalItemCount-parseInt(itemCount)
  
   if(productSelectViewMap.get(selectProdAvail.id).itemCount==0 && this.bucketView.productFullInfoBucketMap.get(selectProdAvail.id).selectedItemCount==0)
   {
    this.bucketView.productFullInfoBucketMap.delete(selectProdAvail.id)
    productSelectViewMap.delete(selectProdAvail.id)
    
   }
   cookieBucket.productSelectViewMap=productSelectViewMap;
   cookieBucket.totalPrice=this.bucketView.totalPrice;
    localStorage.setItem("CookieBucket",this.ObjectToJsonString(cookieBucket));
    
     this.sharedService.setSet(this.bucketView);
  }



  }



 }



 


getTheFullViewMap(productId:any,selectedProdAvail:any,itemCount:any, cookieBucket:CookieBucket)
{
  

   if(this.bucketView.productFullInfoBucketMap.has(selectedProdAvail.id))
   {
   
    this.bucketView.productFullInfoBucketMap.get(selectedProdAvail.id).selectedItemCount=this.bucketView.productFullInfoBucketMap.get(selectedProdAvail.id).selectedItemCount+parseInt(itemCount);
    this.bucketView.totalPrice=cookieBucket.totalPrice+(itemCount*this.bucketView.productFullInfoBucketMap.get(selectedProdAvail.id).price)
    cookieBucket.totalItems=cookieBucket.totalItems+parseInt(itemCount)
    this.bucketView.productFullInfoBucketMap.set(selectedProdAvail.id, this.bucketView.productFullInfoBucketMap.get(selectedProdAvail.id))
    this.bucketView.totalItemCount=cookieBucket.totalItems
    cookieBucket.totalPrice=this.bucketView.totalPrice;
   
    this.sharedService.setSet(this.bucketView);
   }
  else
  {

    this.getProductList(productId,selectedProdAvail,itemCount,cookieBucket);
      
  }
 
  
}


 




getProductList(productId,selectedProdAvail,itemCount,cookieBucket:CookieBucket)
{

var productList;

  this.productService.getProductByCode(productId,selectedProdAvail.id).subscribe(response =>
    {
    
        var product = response;
        this.bucketView.productFullInfoBucketMap.set(selectedProdAvail.id,product);
        this.bucketView.productFullInfoBucketMap.get(selectedProdAvail.id).selectedItemCount=itemCount;
        this.bucketView.totalItemCount=cookieBucket.totalItems+parseInt(itemCount);
       
        this.bucketView.totalPrice=this.bucketView.totalPrice+product.price*itemCount;
        cookieBucket.totalPrice=this.bucketView.totalPrice;
        cookieBucket.totalItems=this.bucketView.totalItemCount;
        localStorage.setItem("CookieBucket",this.ObjectToJsonString(cookieBucket));
         this.sharedService.setSet(this.bucketView);
       
   
   
     
    });
 
}







showCart()
{
 
 
  this.bucketView=new BucketView();
  this.bucketView.productFullInfoBucketMap=new Map<string,BucketModel>();
  if(localStorage.getItem("CookieBucket")=="null")
 {
 
  this.bucketView.totalItemCount=0;
}
else
{
  


   var cookieBucketString= localStorage.getItem("CookieBucket");
   var cookieBucket= this.fetchbucketfrombucketstring(cookieBucketString);
   var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);
   this.bucketView.totalItemCount=cookieBucket.totalItems;
   this.bucketView.totalPrice=cookieBucket.totalPrice;
   var keyString=Array.from(productSelectViewMap.keys()).join()
   var productList;

   this.productService.bucketProductInfo(keyString).subscribe(response =>
    {
      
      productList = response;
      productList.forEach(product=>{ 
      
       var productSelect= productSelectViewMap.get(product.prodAvailId);
       product.selectedItemCount=productSelect.itemCount;
      
       this.bucketView.productFullInfoBucketMap.set(product.prodAvailId,product);
        this.sharedService.setSet(this.bucketView);
      });
  
    });

  
}


   
   

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

ngOnDestroy() {
  // unsubscribe to ensure no memory leaks
  this.subscription.unsubscribe();
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
    productSelectViewMap.get(selectedProdAvail).itemCount=parseInt(selectedItemCount)
    cookieBucket.productSelectViewMap=productSelectViewMap
 }
 localStorage.setItem("CookieBucket",this.ObjectToJsonString(cookieBucket));
}

compareFn(pAv1: ProductAvail, pAv2: ProductAvail): boolean {
  return pAv1 && pAv2 ? pAv1.id === pAv2.id : pAv1 === pAv2;
}

}

 








