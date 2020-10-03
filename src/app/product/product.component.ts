import { Component, OnInit, EventEmitter, Input, ViewChild, ViewChildren, QueryList, ElementRef, HostListener, ComponentFactoryResolver } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './Product';
import { Router,ActivatedRoute, NavigationStart, RoutesRecognized, RouteConfigLoadStart, RouteConfigLoadEnd, NavigationEnd } from '@angular/router';
import {Output} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductSelect } from './productselectview';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { CookieBucket } from '../menus/bucketcookie';
import { Subscription } from 'rxjs';
import { SharedService } from '../sharedservice.service';
import { ProductAvail } from './productavail';
import { BucketView } from './bucketview';
import { BucketModel } from './bucketmodel';
import * as $ from 'jquery';
import { FilterComponent } from 'src/app/filter/filter.component';
import { FilterParams } from 'src/app/filter/filterparams';
import { SearchProduct } from './search-product';
import { AppService } from '../app-service';



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers:[ProductService,CookieService ]
})



export class ProductComponent implements OnInit{
 
 
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
 rest:boolean;

 @ViewChild(FilterComponent)
    private filterComponent: FilterComponent;

 @Input() filterParams:FilterParams=new FilterParams();

 private subscription: Subscription;
 COOKIE_BUCKET_ID:string="DefaultBucket"
 

 constructor(private productService: ProductService,private activatedRoute:ActivatedRoute,private router:Router,private cookieService:CookieService ,private sharedService:SharedService,private appService:AppService) {
 
 
 
  this.subscription= this.sharedService.getState().subscribe(bucketView=>{
   
    this.bucketView=bucketView
   
  });


  this.subscription= this.sharedService.getResetAll().subscribe(rest=>{
   
    this.rest=rest
  
    this.resetFilter();
   
  });

}
 



ngOnInit() {

  let userStorage=localStorage.getItem("USER");
  if(userStorage!=null)
  {
   let userInfo= JSON.parse(localStorage.getItem("USER"));
   if(userInfo && userInfo.userId!=null)
   this.COOKIE_BUCKET_ID=userInfo.userId;
  }

this.showCart();

if (this.router.url.includes('cat'))
{

  this.activatedRoute.queryParams.subscribe(routeParams => {
   
    this.catId=routeParams.catId
    this.subId=routeParams.subId
    
     if(this.subId!=null)
    {
    this.productBasedOnSubCategory();
    }
    else{
      this.productBasedOnCategory();
    }
    this.filterComponent.setCategorySubCategory(this.catId,this.subId);
    this.filterComponent.getFilterMetaData(this.catId,this.subId)
    this.filterComponent.fetchMetaLeft();
    
   });

 

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
 resetFilter()
 {

   this.filterComponent.resetAll();
  
 }
 
 fetchFilters(event) { 

   this. filterParams=event
   let brandPayLoad=this.filterParams.brandFilters.join(",")
    let pricePayLoad=this.filterParams.priceFilters.join(",")
    let weightPayLoad=this.filterParams.weightFilters.join(",")

    let 
    params=null;
 
 console.log(this.filterParams)
    window.scroll(0,0);
    let search=null;

    if (typeof this.search !== 'undefined') {
      // someglobal is now safe to use
      search=this.search;
    }
  if(this.catId!=null)
  {

     
  params={
    'catId': this.catId,
    'search':search,
    'brandFilters':brandPayLoad,
    'priceFilters':pricePayLoad,
    'weightFilters':weightPayLoad
  }
 
    }
    else if(this.catId!=null && this.subId!=null)
    {
       
      params={
        'catId': this.catId,
        'subId': this.subId,
        'search':search,
        'brandFilters':brandPayLoad,
        'priceFilters':pricePayLoad,
        'weightFilters':weightPayLoad
      }
    }
    else{
     
      params={
        'search':search,
        'brandFilters':brandPayLoad,
        'priceFilters':pricePayLoad,
        'weightFilters':weightPayLoad
      }
    }


    this.productService.productByFilter(params).subscribe(response =>
      {
       
     
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

 console.log(params)
    this.productService.productBasedOnName(params).subscribe(response =>
      {
       
       
        console.log(this.productList)
        this.productSearchList = response;
        console.log('Products based on Category From DB')

          this.productSearchList.forEach(productSearch=>{
            productSearch.prod.selectedItemCount=1;
            productSearch.prod.itemCountList=[1,2,3,4];
            productSearch.prod.selectedProductAvail=  productSearch.prod.productAvailList[0];
          }  
        )
       
      });
      
   
  
  }
 
addToCart(productSearch:any)
  {
    let productId=productSearch.prod.code;
    let selectedProductAvail=productSearch.prod.selectedProductAvail;
    let itemCount=productSearch.prod.selectedItemCount
 
   
  if(itemCount==null &&  selectedProductAvail==null)
  {
    return ;
  }
  if(this.bucketView==null)
    {
     
      this.bucketView=new BucketView();
      this.bucketView.productFullInfoBucketMap=new Map<string,BucketModel>();
      

    }
 
   if(localStorage.getItem(this.COOKIE_BUCKET_ID)=="null" || localStorage.getItem(this.COOKIE_BUCKET_ID)==null)
   {

     var cookieBucket=new CookieBucket();
     var  productSelectItemNew=new ProductSelect(productId,selectedProductAvail.id,itemCount);
    /*  alert("1")
     $("#quantity").val(itemCount); */
     cookieBucket.getProductSelectMapView().set(selectedProductAvail.id,productSelectItemNew);
     this.getTheFullViewMap(productId,selectedProductAvail,parseInt(itemCount),cookieBucket);
     
   
      
  }
  else
  {
     var bucketItemString= localStorage.getItem(this.COOKIE_BUCKET_ID);
     var cookieBucket= this.fetchbucketfrombucketstring(bucketItemString);
     var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);
     
    if(productSelectViewMap.has(selectedProductAvail.id))
    {
     
      productSelectViewMap.get(selectedProductAvail.id).itemCount=parseInt(productSelectViewMap.get(selectedProductAvail.id).itemCount)+parseInt(itemCount)+''
     
      cookieBucket.productSelectViewMap=productSelectViewMap;
      this.getTheFullViewMap(productId,selectedProductAvail,parseInt(itemCount),cookieBucket);
      localStorage.setItem(this.COOKIE_BUCKET_ID,this.ObjectToJsonString(cookieBucket));
   
    }
    else
    {
     
      var productSelect=new ProductSelect(productId,selectedProductAvail.id,itemCount);
  
      productSelectViewMap.set(selectedProductAvail.id,productSelect)
      cookieBucket.productSelectViewMap=productSelectViewMap;
      this.getTheFullViewMap(productId,selectedProductAvail,parseInt(itemCount),cookieBucket);
      
     
    }
  
    }
  
  
}
 


  removeFromCart(productSearch)
  {
   
    let selectProdAvail=productSearch.prod.selectedProductAvail;
    let itemCount=productSearch.prod.selectedItemCount
 
if(!(localStorage.getItem(this.COOKIE_BUCKET_ID)=="null"))
 {

     var bucketItemString= localStorage.getItem(this.COOKIE_BUCKET_ID);
     var cookieBucket:CookieBucket=this.fetchbucketfrombucketstring(bucketItemString);
     var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);
  if(productSelectViewMap.has(selectProdAvail.id) && parseInt(productSelectViewMap.get(selectProdAvail.id).itemCount)>0 && cookieBucket.totalItems>=parseInt(itemCount))
  {
    this.bucketView.productFullInfoBucketMap.get(selectProdAvail.id).selectedItemCount=(parseInt(this.bucketView.productFullInfoBucketMap.get(selectProdAvail.id).selectedItemCount)-parseInt(itemCount))+'';
    this.bucketView.totalPrice=this.bucketView.totalPrice-(parseInt(itemCount)*this.bucketView.productFullInfoBucketMap.get(selectProdAvail.id).price)
    productSelectViewMap.get(selectProdAvail.id).itemCount=(parseInt(productSelectViewMap.get(selectProdAvail.id).itemCount)-parseInt(itemCount))+''
  
    cookieBucket.totalItems= cookieBucket.totalItems-parseInt(itemCount)
    this.bucketView.totalItemCount= this.bucketView.totalItemCount-parseInt(itemCount)
  
   if(parseInt(productSelectViewMap.get(selectProdAvail.id).itemCount)==0 && parseInt(this.bucketView.productFullInfoBucketMap.get(selectProdAvail.id).selectedItemCount)==0)
   {
    this.bucketView.productFullInfoBucketMap.delete(selectProdAvail.id)
    productSelectViewMap.delete(selectProdAvail.id)
    
   }
   cookieBucket.productSelectViewMap=productSelectViewMap;
   cookieBucket.totalPrice=this.bucketView.totalPrice;
    localStorage.setItem(this.COOKIE_BUCKET_ID,this.ObjectToJsonString(cookieBucket));
    
     this.sharedService.setSet(this.bucketView);
  }



  }



 }



 


getTheFullViewMap(productId:any,selectedProdAvail:any,itemCount:number, cookieBucket:CookieBucket)
{
  

   if(this.bucketView.productFullInfoBucketMap.has(selectedProdAvail.id))
   {
   
    this.bucketView.productFullInfoBucketMap.get(selectedProdAvail.id).selectedItemCount=(parseInt(this.bucketView.productFullInfoBucketMap.get(selectedProdAvail.id).selectedItemCount)+itemCount)+'';
    this.bucketView.totalPrice=cookieBucket.totalPrice+(itemCount*this.bucketView.productFullInfoBucketMap.get(selectedProdAvail.id).price)
    cookieBucket.totalItems=cookieBucket.totalItems+itemCount
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
        localStorage.setItem(this.COOKIE_BUCKET_ID,this.ObjectToJsonString(cookieBucket));
         this.sharedService.setSet(this.bucketView);
       
   
   
     
    });
 
}







showCart()
{
 
 
  this.bucketView=new BucketView();
  this.bucketView.productFullInfoBucketMap=new Map<string,BucketModel>();

  
if(this.appService.checkForNullONullString(localStorage.getItem(this.COOKIE_BUCKET_ID)))
{
  var cookieBucketString= localStorage.getItem(this.COOKIE_BUCKET_ID);
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
else{
  this.bucketView.totalItemCount=0;
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

  if(bucketViewFromString!=null)
  {
  var map = new Map<string,ProductSelect>(JSON.parse(bucketViewFromString.productSelectViewMap));
  bucketViewFromString.productSelectViewMap=null;
  }
  return map;
}

ngOnDestroy() {
 
  this.subscription.unsubscribe();
}



updateCookieBucket(selectedProdAvail:any,selectedItemCount:any,totalItemCount:any,totalPrice:any)
{
 
  
  if(localStorage.getItem(this.COOKIE_BUCKET_ID)=="null")
  {
   this.bucketView.totalItemCount=0;
 }
 else
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
    productSelectViewMap.get(selectedProdAvail).itemCount=selectedItemCount
    cookieBucket.productSelectViewMap=productSelectViewMap
 }
 localStorage.setItem(this.COOKIE_BUCKET_ID,this.ObjectToJsonString(cookieBucket));
}

compareFn(pAv1: ProductAvail, pAv2: ProductAvail): boolean {
  return pAv1 && pAv2 ? pAv1.id === pAv2.id : pAv1 === pAv2;
}

}

 








