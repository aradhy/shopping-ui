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
import { BucketModel } from '../product/bucketmodel';


@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css'],
  providers:[CookieService ]
})
export class MenusComponent implements OnInit {
  

  

  @Input() bucketView:BucketView;
  @Input() customerName:string;
  public categoryList:Category[];
  public categoryListAll:Category[];
  public sub_categoryList:SubCategory[];


 
  

  constructor(private categoryService: CategoryService,private router:Router,private sharedSerevice: SharedService,private productService: ProductService) {
   
   
   }


   
  ngOnInit() {
    
  
    if(localStorage.getItem("customerName")!='null' || localStorage.getItem("customerName")!="null")
    {
      this.customerName=localStorage.getItem("customerName");

    }
    else{
      this.customerName=null;
    }
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
 
  var selectedCount=this.bucketView.productFullInfoBucketMap.get(x).selectedItemCount;
  this.bucketView.totalItemCount=(this.bucketView.totalItemCount)- selectedCount;
  this.bucketView.totalPrice=this.bucketView.totalPrice-(selectedCount*this.bucketView.productFullInfoBucketMap.get(x).price)
  this.bucketView.productFullInfoBucketMap.delete(x);
  this.sharedSerevice.setSet(this.bucketView);
  this.updateCookieBucket(x,0,this.bucketView.totalItemCount,this.bucketView.totalPrice)
}
 
addQty(selectedProdAvail:any,selectedItemCount:any)
{
 
  this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount=parseInt(selectedItemCount)+1
  var updatedSelectedItemCount=this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount;
  this.bucketView.totalItemCount=this.bucketView.totalItemCount+ 1;
  this.bucketView.totalPrice=this.bucketView.totalPrice+(this.bucketView.productFullInfoBucketMap.get(selectedProdAvail.id).price)
  this.sharedSerevice.setSet(this.bucketView);
  this.updateCookieBucket(selectedProdAvail,this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount,this.bucketView.totalItemCount,this.bucketView.totalPrice)
 
}

subQty(selectedProdAvail:any,selectedItemCount:any)
{
  if(selectedItemCount>0)
  {
    
  this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount=parseInt(selectedItemCount)-1
  this.bucketView.totalPrice=this.bucketView.totalPrice-(1*this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).price)
  this.bucketView.totalItemCount=(this.bucketView.totalItemCount)- 1
  this.sharedSerevice.setSet(this.bucketView);
  if(this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount==0)
  this.bucketView.productFullInfoBucketMap.delete(selectedProdAvail)
   this.updateCookieBucket(selectedProdAvail,0,this.bucketView.totalItemCount,this.bucketView.totalPrice)
  this.updateCookieBucket(selectedProdAvail,this.bucketView.productFullInfoBucketMap.get(selectedProdAvail).selectedItemCount,this.bucketView.totalItemCount,this.bucketView.totalPrice)
  
  }
  
  
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

showCart()
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

logout()
{
  localStorage.setItem("JWT-TOKEN",null)
  localStorage.setItem("X-CSRF-TOKEN",null)
  localStorage.setItem("PROVIDER",null)
  localStorage.setItem("customerName",null)
  this.router.navigateByUrl("/category-view");
  this.customerName=null;
 
}
}
