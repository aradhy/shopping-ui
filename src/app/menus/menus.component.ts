import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category';
import { SubCategory } from '../category/sub-category';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ProductSelect } from '../product/productselectview';
import { CookieBucket } from './bucketcookie';
import { ProductService } from '../product/product.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../sharedservice.service';
import { Product } from '../product/product';
import { ProductAvail } from '../product/productavail';
import { BucketView } from '../product/bucketview';


@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css'],
  providers:[CookieService ]
})
export class MenusComponent implements OnInit {
  

  @Input() cookieBucket: CookieBucket;

  @Input() bucketView:BucketView;
  public categoryList:Category[];
  public categoryListAll:Category[];
  public sub_categoryList:SubCategory[];


 
  

  constructor(private categoryService: CategoryService,private router:Router,private sharedSerevice: SharedService,private productService: ProductService) {
   
   
   }


   
  ngOnInit() {
   
    this.showCart()
  
 

}


  searchProduct(regForm:NgForm)
  {
    var productSearch=regForm.controls.search.value;
    if(productSearch!='')
    this.router.navigate(['product-name'],{ queryParams: { productName: productSearch } });
  
  }

  mouse_event()
  {
  
    this.categoryService.getCategories().subscribe(response =>
      {
       
        this.categoryList = response;
        console.log('Category From DB')
       
      });
      
      
    return this.categoryList;
  
  }

  mouse_event_sub(categoryId)
  {
    console.log(categoryId)
    this.categoryService.getSubCategories(categoryId).subscribe(response =>
      {
       
      
        this.sub_categoryList = response;
        console.log('SubCategory From DB')
       
        
       
      });
      
      
    return this.sub_categoryList;
  }

removeFromBucket(x:string)
{


  this.cookieBucket.totalItems=(parseInt(this.cookieBucket.totalItems)- parseInt(this.cookieBucket.productSelectViewMap.get(x).itemCount)).toString();
 
  this.cookieBucket.productSelectViewMap.delete(x);
 // this.sharedSerevice.setSet(this.cookieBucket.productSelectViewMap);
  
  localStorage.setItem("CookieBucket",this.ObjectToJsonString(this.cookieBucket));
 
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
   
      this.sharedSerevice.setSet(this.bucketView);
    });

  
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
