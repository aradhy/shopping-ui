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
    


    addToCart(itemCount:any)
  {

  if(itemCount==null &&  this.product.selectedProductAvail==null)
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
     var  productSelectItemNew=new ProductSelect(this.product.code,this.product.selectedProductAvail.id,itemCount);
     cookieBucket.getProductSelectMapView().set(this.product.selectedProductAvail.id,productSelectItemNew);
     this.getTheFullViewMap(this.product.code,this.product.selectedProductAvail,itemCount,cookieBucket);
    
   
      
  }
  else
  {
     var bucketItemString= localStorage.getItem("CookieBucket");
     var cookieBucket= this.fetchbucketfrombucketstring(bucketItemString);
     var productSelectViewMap= this.fetchmapfrombucketstring(cookieBucket);
     
    if(productSelectViewMap.has(this.product.selectedProductAvail.id))
    {

      productSelectViewMap.get(this.product.selectedProductAvail.id).itemCount=(productSelectViewMap.get(this.product.selectedProductAvail.id).itemCount)+parseInt(itemCount)
      cookieBucket.productSelectViewMap=productSelectViewMap;
      this.getTheFullViewMap(this.product.code,this.product.selectedProductAvail,itemCount,cookieBucket);
      localStorage.setItem("CookieBucket",this.ObjectToJsonString(cookieBucket));
   
    }
    else
    {
     
      var productSelect=new ProductSelect(this.product.code,this.product.selectedProductAvail.id,itemCount);
      productSelectViewMap.set(this.product.selectedProductAvail.id,productSelect)
      cookieBucket.productSelectViewMap=productSelectViewMap;
      this.getTheFullViewMap(this.product.code,this.product.selectedProductAvail,itemCount,cookieBucket);
      
     
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

compareFn(pAv1: ProductAvail, pAv2: ProductAvail): boolean {
  return pAv1 && pAv2 ? pAv1.id === pAv2.id : pAv1 === pAv2;
}
}
