import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product';
import { Router,ActivatedRoute } from '@angular/router';
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


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers:[ProductService,CookieService ]
})



export class ProductComponent implements OnInit {
 
 
@Output() bucketViewEmitter: EventEmitter<BucketView> = new EventEmitter();  


 public productList:Product[]=[];

 public name:String;
 url:string;
 id:string;
 bucketView:BucketView;

private subscription: Subscription;
 



  constructor(private productService: ProductService,private activatedRoute:ActivatedRoute,private router:Router,private cookieService:CookieService ,private sharedService:SharedService) {
   
    this.subscription= this.sharedService.getState().subscribe(bucketView=>{
      this.bucketView=bucketView
     
    });

  }

  

  compareFn(pAv1: ProductAvail, pAv2: ProductAvail): boolean {
    return pAv1 && pAv2 ? pAv1.id === pAv2.id : pAv1 === pAv2;
  }
  ngOnInit() {
  
  
    this.showCart();
  if (this.router.url.includes('sub'))
  {
   
    this.activatedRoute.params.subscribe(routeParams => {
      this.productBasedOnSubCategory(routeParams.id);
     });
    
  }
  else if(this.router.url.includes('cat'))
  {
   
  this.activatedRoute.params.subscribe(routeParams => {
   this.productBasedOnCategory(routeParams.id);
  })

 

}
 else{
  
    this.activatedRoute.queryParams.subscribe(queryParams => {
      
      this.productBasedSearch (queryParams['productName']);
      
     })
   }
    
 }

  
   productBasedOnCategory(id)
  {

  
   this.id=id;
    
   
    this.productService.getProductByCategory(this.id).subscribe(response =>
      {
       
        this.productList = response;
        console.log('Products based on Category From DB')

          this.productList.forEach(product=>{
            product.selectedItemCount=1;
            product.itemCountList=[1,2,3,4];
            product.selectedProductAvail= product.productAvailList[0];
          }  
        )
        return this.productList;
    
          });
       
  }

  productBasedOnSubCategory(id)
  {

   
    this.id=id;
    this.productService.getProductBySubCategory(this.id).subscribe(response =>
      {
       
        this.productList = response;
        console.log('Products based on Sub Category From DB')
       
      });
      
    return this.productList;
  
  }

  productBasedSearch (name)
  {

   
    this.name=name;
 
    this.productService.productBasedOnName(name).subscribe(response =>
      {
       
        this.productList = response;
        console.log('Products based on name  search')
       
      });
      
    return this.productList;
  
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
 
 
if(!(localStorage.getItem("CookieBucket")==null))
 {

     var bucketItemString= localStorage.getItem("CookieBucket");
     var cookieBucket:CookieBucket=this.fetchbucketfrombucketstring(bucketItemString);
     var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);
    

  if(productSelectViewMap.has(selectProdAvail) && productSelectViewMap.get(selectProdAvail).itemCount>0 && cookieBucket.totalItems>=itemCount)
  {
    this.bucketView.productFullInfoBucketMap.get(selectProdAvail).selectedItemCount=this.bucketView.productFullInfoBucketMap.get(selectProdAvail).selectedItemCount-parseInt(itemCount);
    this.bucketView.totalPrice=this.bucketView.totalPrice-(parseInt(itemCount)*this.bucketView.productFullInfoBucketMap.get(selectProdAvail).price)
    productSelectViewMap.get(selectProdAvail).itemCount=productSelectViewMap.get(selectProdAvail).itemCount-parseInt(itemCount)
  
    cookieBucket.totalItems= cookieBucket.totalItems-parseInt(itemCount)
    this.bucketView.totalItemCount= this.bucketView.totalItemCount-parseInt(itemCount)
  
   if(productSelectViewMap.get(selectProdAvail).itemCount==0 && this.bucketView.productFullInfoBucketMap.get(selectProdAvail).selectedItemCount==0)
   {
    this.bucketView.productFullInfoBucketMap.delete(selectProdAvail)
    productSelectViewMap.delete(selectProdAvail)
    
   }
   cookieBucket.productSelectViewMap=productSelectViewMap;
   cookieBucket.totalPrice=this.bucketView.totalPrice;
    localStorage.setItem("CookieBucket",this.ObjectToJsonString(cookieBucket));
    
    this.bucketViewEmitter.emit(this.bucketView);
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
    this.bucketViewEmitter.emit(this.bucketView)
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
        this.bucketViewEmitter.emit(this.bucketView);
       
   
   
     
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
       this.bucketViewEmitter.emit(this.bucketView);
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



}

 








