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
import { ProductAvail } from '../product/productavail';
import { Subscription } from 'rxjs';

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
    private subscription: Subscription;
    constructor(private activatedRoute:ActivatedRoute,private productService:ProductService, private sharedService:SharedService)
    {
       this.activatedRoute.params.subscribe(routeParams => {
           this.catId=routeParams.catId
           this.subId=routeParams.subId
           this.code=routeParams.code
           this.prodAvailId=routeParams.prodAvailId
         
         

    }); 

 

   }

    ngOnInit(): void {
        $("#filter").hide();
       
        customSingleImageView();
      this.productService.productBasedOnCode(this.code).subscribe(prod=>
        {
        this.product=prod
        this.product.selectedItemCount=1;
        this.product.itemCountList=[1,2,3,4];
        this.product.selectedProductAvail=this.product.productAvailList[0]
        for(let prodAvail of  this.product.productAvailList)
        {
            if(this.prodAvailId==prodAvail.id)
            {
                this.product.selectedProductAvail=prodAvail
                break;
            }
        }
       
        }

      )
      this.showCart()
    }
    ngAfterViewInit()
    {
      let id =this.prodAvailId;
     
      let idCss='#'+id
    
      $("#1").css("border-color", "red");
     $(idCss).css("background-color", "greenyellow");
    
    }
    selectProdAvail(prodAvail)
    {
       this.product.selectedProductAvail=prodAvail
       let id =prodAvail.id;
       let idCss='#'+id
       $(".prodAvailSpan").css("border-color", "grey");
       $(idCss).css("border-color", "red");
       $(".prodAvailSpan").css("background-color", "white");
       $(idCss).css("background-color", "greenyellow");

       


    }

   
    addQty()
    {
      this.product.selectedItemCount=this.product.selectedItemCount+1
    }


    subQty()
    {
      if( this.product.selectedItemCount>0)
      {
        this.product.selectedItemCount= this.product.selectedItemCount-1
      
      }
    
    }
    
  addToCart(productId:any,selectedProductAvail:any,itemCount:any)
  {
    this.product.selectedItemCount=this.product.selectedItemCount+1
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
 if(parseInt(itemCount)>0)
 {
  this.product.selectedItemCount=this.product.selectedItemCount+1
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
     
       if(this.prodAvailId==product.prodAvailId)
       {
          this.product.selectedItemCount=productSelectViewMap.get(this.prodAvailId).itemCount
       }
      
         this.bucketView.productFullInfoBucketMap.set(product.prodAvailId,product);
          this.sharedService.setSet(this.bucketView);
        });
    
      });
  
    
  }
  
}
}
