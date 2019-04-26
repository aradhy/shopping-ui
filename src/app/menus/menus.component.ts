import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category';
import { SubCategory } from '../category/sub-category';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ProductSelect } from '../product/productselectview';
import { BucketView } from './bucketview';
import { stringify } from 'querystring';
import { ProductService } from '../product/product.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../sharedservice.service';


@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css'],
  providers:[CookieService ]
})
export class MenusComponent implements OnInit {
  

  @Input() bucketView: BucketView;

  public categoryList:Category[];
  public categoryListAll:Category[];
  public sub_categoryList:SubCategory[];


 
  

  constructor(private categoryService: CategoryService,private router:Router,private sharedSerevice: SharedService) {
   
   
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


  this.bucketView.totalItems=(parseInt(this.bucketView.totalItems)- parseInt(this.bucketView.productSelectViewMap.get(x).itemCount)).toString();
 
  this.bucketView.productSelectViewMap.delete(x);
  this.sharedSerevice.setSet(this.bucketView.productSelectViewMap);
  
  localStorage.setItem("BucketItemView",this.ObjectToJsonString(this.bucketView));
 
}
 


showCart()
{

  
 
  if(localStorage.getItem("BucketItemView")=="null")
 {
   var bucketView=new BucketView();
   bucketView.setTotalItems("0");
   this.bucketView=bucketView;
}
else
{
 
   var bucketItemString= localStorage.getItem("BucketItemView");
   var bucketView= this.fetchbucketfrombucketstring(bucketItemString);
   var productSelectViewMap= this.fetchmapfrombucketstring(bucketView);
   this.bucketView=bucketView
   this.bucketView.productSelectViewMap=productSelectViewMap;
  
  
}

   
   

}

fetchbucketfrombucketstring(bucketItemString:string):BucketView
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

ObjectToJsonString(bucketItem:BucketView):string
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
