import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product/product';
import { ProductService } from '../product/product.service';
import { CookieBucket } from '../menus/bucketcookie';
import { ProductSelect } from '../product/productselectview';
import { SharedService } from '../sharedservice.service';
import { BucketView } from '../product/bucketview';
import { BucketModel } from '../product/bucketmodel';

declare var customSingleImageView:any;


@Component({
    selector: 'app-single-product-view',
    templateUrl: './single-product-view.component.html',
    styleUrls: ['./single-product-view.component.css']
})



export class SingleProductViewComponent implements OnInit {
    
     catId:string;
    subId:string;
    code:string;
    prodAvailId:string;
    public product:Product;
    bucketView:BucketView;
    ngOnInit(): void {
        $("#filter").hide();
        customSingleImageView();
      this.productService.productBasedOnCode(this.code).subscribe(prod=>
        {
           
        this.product=prod
        this.product.selectedItemCount=1;
        this.product.itemCountList=[1,2,3,4];
        for(let prodAvail of this.product.productAvailList)
        {
            if(this.prodAvailId==prodAvail.id)
            {
                this.product.selectedProductAvail=prodAvail
                break;
            }
        }

        }

      )
    }

     constructor(private activatedRoute:ActivatedRoute,private productService:ProductService, private sharedService:SharedService)
     {
        this.activatedRoute.params.subscribe(routeParams => {
            this.catId=routeParams.catId
            this.subId=routeParams.subId
            this.code=routeParams.code
            this.prodAvailId=routeParams.prodAvailId
          
          

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
 
 
if(!(localStorage.getItem("CookieBucket")==null))
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
