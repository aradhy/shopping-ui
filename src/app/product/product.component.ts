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

          this.productList.forEach(p=>
          this.setProductForQuantityPriceDropDowns(p,null,1));
        })
    
        return this.productList;
  
  
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
 
addToCart(productId:any,selectedQuant:any,itemCount:any)
  {
 
   
  if(itemCount==null &&  selectedQuant==null)
  {
    return ;
  }
    if(this.bucketView==null)
    {
      this.bucketView=new BucketView();
      this.bucketView.productFullInfoBucketMap=new Map<string,Product>();
      

    }

   if(localStorage.getItem("CookieBucket")=="null")
   {

     var cookieBucket=new CookieBucket();
     var  productSelectItemNew=new ProductSelect(productId,selectedQuant.id,itemCount);
     cookieBucket.getProductSelectMapView().set(productId,productSelectItemNew);
     var productSelectViewMap=cookieBucket.productSelectViewMap;
     this.bucketView.totalItemCount=parseInt(itemCount)
     this.getTheFullViewMap(productId,selectedQuant,itemCount);
     cookieBucket.setTotalItems(itemCount);
      
  }
  else
  {
     var bucketItemString= localStorage.getItem("CookieBucket");
     var cookieBucket= this.fetchbucketfrombucketstring(bucketItemString);
     var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);
     
    if(productSelectViewMap.has(productId))
    {
     
      productSelectViewMap.get(productId).itemCount=(parseInt(productSelectViewMap.get(productId).itemCount)+parseInt(itemCount)).toString();
      cookieBucket.totalItems=(parseInt(cookieBucket.totalItems)+parseInt(itemCount)).toString();
      cookieBucket.productSelectViewMap=productSelectViewMap;
      this.getTheFullViewMap(productId,selectedQuant,parseInt(productSelectViewMap.get(productId).itemCount));
      this.bucketView.totalItemCount=parseInt(cookieBucket.totalItems)
      this.bucketViewEmitter.emit(this.bucketView)
    }
    else
    {
     
      var productSelect=new ProductSelect(productId,selectedQuant.id,itemCount);
      productSelectViewMap.set(productId,productSelect)
      cookieBucket.totalItems=(parseInt(cookieBucket.totalItems)+parseInt(itemCount)).toString();
      cookieBucket.productSelectViewMap=productSelectViewMap;
      this.getTheFullViewMap(productId,selectedQuant,itemCount);
      this.bucketView.totalItemCount=parseInt(cookieBucket.totalItems);
     
    }
  
    }
  
    
      localStorage.setItem("CookieBucket",this.ObjectToJsonString(cookieBucket));
     
  }
  removeFromCart(productId:any,itemCount:any)
  {
 
 
    if(!(localStorage.getItem("CookieBucket")==null))
 {

     var bucketItemString= localStorage.getItem("CookieBucket");
     var cookieBucket:CookieBucket=this.fetchbucketfrombucketstring(bucketItemString);
     var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);
    
if(this.bucketView.productFullInfoBucketMap.has(productId))
{
  this.bucketView.productFullInfoBucketMap.delete(productId)
}
  if(productSelectViewMap.has(productId))
  {

    cookieBucket.totalItems= (parseInt(cookieBucket.totalItems)-parseInt(productSelectViewMap.get(productId).itemCount)).toString();
    
    productSelectViewMap.delete(productId);
    cookieBucket.productSelectViewMap=productSelectViewMap;
    this.bucketView.productFullInfoBucketMap.delete(productId)
    this.bucketView.totalItemCount=parseInt(cookieBucket.totalItems);
    localStorage.setItem("CookieBucket",this.ObjectToJsonString(cookieBucket));
    this.bucketViewEmitter.emit(this.bucketView);
  }



  }



 }


selectChange(event)
{
alert(event.target.value)
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



getTheFullViewMap(productId:any,selectedProdAvail:string,itemCount:number)
{


   if(this.bucketView.productFullInfoBucketMap.has(productId))
   {
 
 
    this.bucketView.productFullInfoBucketMap.get(productId).selectedItemCount=itemCount;

    this.bucketView.productFullInfoBucketMap.set(productId, this.bucketView.productFullInfoBucketMap.get(productId))

   }
  else
  {

    this.getProductList(productId,selectedProdAvail,itemCount);

    
  }
 
  
}


 



getProductList(productId,selectedProdAvail,itemCount)
{

var productList;

  this.productService.getProductByCode(productId).subscribe(response =>
    {
     
      productList = response;
      productList.forEach(product=>{ 
      
        this.setProductForQuantityPriceDropDowns(product,selectedProdAvail,itemCount)
      
        this.bucketView.productFullInfoBucketMap.set(productId,product);
    
        this.bucketViewEmitter.emit(this.bucketView);
       
      });
   
     
    });
 
}


setProductForQuantityPriceDropDowns(product:Product,selectedProdAvail:any,selectedItemCount:number)
{

  product.selectedItemCount=selectedItemCount;
  product.itemCountList=['1','2','3','4']

 
if(selectedProdAvail==null)
  product.selectedProductAvail=product.productAvailList[0];
else
{
 
  product.selectedProductAvail=selectedProdAvail

}

}


ngOnDestroy() {
  // unsubscribe to ensure no memory leaks
  this.subscription.unsubscribe();
}

showCart()
{

  this.bucketView=new BucketView();
  this.bucketView.productFullInfoBucketMap=new Map<string,Product>();
  if(localStorage.getItem("CookieBucket")=="null")
 {
  this.bucketView.totalItemCount=0;
}
else
{
  
 

   var cookieBucketString= localStorage.getItem("CookieBucket");
   var cookieBucket= this.fetchbucketfrombucketstring(cookieBucketString);
   var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);
   this.bucketView.totalItemCount=parseInt(cookieBucket.totalItems);

   var keyString=Array.from(productSelectViewMap.keys()).join()
   var productList;
  
   this.productService.bucketProductInfo(keyString).subscribe(response =>
    {
      
      productList = response;
      productList.forEach(product=>{ 
       var productSelect= productSelectViewMap.get(product.code);
    
       for(let productAvail of product.productAvailList)
       {
       
        if(productSelect.selctedProdAvailCode==productAvail.id)
        {
         
          product.selectedProductAvail=productAvail;
        }
       }
       product.selectedItemCount=productSelect.itemCount;
       product.itemCountList=['1','2','3','4']
       this.bucketView.productFullInfoBucketMap.set(product.code,product);
       
      });
  
    });

  
}


   
   

}


}

 








