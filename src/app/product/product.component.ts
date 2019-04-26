import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product';
import { Router,ActivatedRoute } from '@angular/router';
import {Output} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductSelect } from './productselectview';

import { CookieService } from 'ngx-cookie-service';
import { BucketView } from '../menus/bucketview';
import { Subscription } from 'rxjs';
import { SharedService } from '../sharedservice.service';
declare var custom:any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers:[ProductService,CookieService ]
})

export class ProductComponent implements OnInit {
 
  //@Output() totalBucketItems: EventEmitter<string> = new EventEmitter();  
@Output() bucketViewEmitter: EventEmitter<BucketView> = new EventEmitter();  

 public productList:Product[];

 public name:String;
 url:string;
 id:string;
 totalProductSelect:Array<ProductSelect>=[];
 
 productIdCount:number;
productSelectViewMap:Map<string,ProductSelect>;
private subscription: Subscription;
 

  constructor(private productService: ProductService,private activatedRoute:ActivatedRoute,private router:Router,private cookieService:CookieService ,private sharedService:SharedService) {
  
    this.subscription = this.sharedService.getState().subscribe(
      productSelectViewMap => {
      
        this.productSelectViewMap = productSelectViewMap;
      });

  }

  ngOnInit() {
  
  //  this.selectedMap.

   // this.cookieService.deleteAll();
if(localStorage.getItem("BucketItemView")!="null")
{
    //this.selectedMap=new Map<string,string>();
    var bucketItemString= localStorage.getItem("BucketItemView");
  
    var bucketView= this.fetchbucketfrombucketstring(bucketItemString);
     this.productSelectViewMap= this.fetchmapfrombucketstring(bucketView);
   
    
    
  
}
  
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
          { 
            
            p.selectedQuantity='1';
            p.quantityList=['1','2','3']

          if(p.productAvailList[0].weight!=null)
            p.selectedProductAvail=(p.productAvailList[0].weight).toString()+'-'+(p.productAvailList[0].weightUnit).toString()+' Rs '+(p.productAvailList[0].price).toString();
          else{
           
            p.selectedProductAvail="Empty"
          }
          });
       
      }

       
      );
    
    
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
 
   addToCart(productId:any,itemCount:any,selectedQuant:any)
  {
 

  if(itemCount==null &&  selectedQuant==null)
  {
    return ;
  }
   if(localStorage.getItem("BucketItemView")=="null")
   {
     
     var bucketView=new BucketView();
     var  productSelectItemNew=new ProductSelect(productId,selectedQuant,itemCount);
     bucketView.getProductSelectMapView().set(productId,productSelectItemNew);
     this.productSelectViewMap=bucketView.productSelectViewMap;
    
     bucketView.setTotalItems(itemCount);
  }
  else
  {
    
     var bucketItemString= localStorage.getItem("BucketItemView");
     var bucketView= this.fetchbucketfrombucketstring(bucketItemString);
     this.productSelectViewMap= this.fetchmapfrombucketstring(bucketView);
     
    if(this.productSelectViewMap.has(productId))
    {
     
    
      this.productSelectViewMap.get(productId).itemCount=(parseInt(this.productSelectViewMap.get(productId).itemCount)+parseInt(itemCount)).toString();
    
      bucketView.totalItems=(parseInt(bucketView.totalItems)+parseInt(itemCount)).toString();
      bucketView.productSelectViewMap=this.productSelectViewMap;
   
    }
    else
    {
      
      var productSelect=new ProductSelect(productId,selectedQuant,itemCount);
      this.productSelectViewMap.set(productId,productSelect)
      bucketView.totalItems=(parseInt(bucketView.totalItems)+parseInt(itemCount)).toString();
     
      bucketView.productSelectViewMap=this.productSelectViewMap;
    }

    }
    
    localStorage.setItem("BucketItemView",this.ObjectToJsonString(bucketView));
      this.bucketViewEmitter.emit(bucketView)
     

  }
  removeFromCart(productId:any,itemCount:any)
  {
 
 
    if(!(localStorage.getItem("BucketItemView")=="null"))
 {

     var bucketItemString= localStorage.getItem("BucketItemView");
     var bucketView:BucketView=this.fetchbucketfrombucketstring(bucketItemString);
     this.productSelectViewMap= this.fetchmapfrombucketstring(bucketView);

  if(this.productSelectViewMap.has(productId) )
  {

    var totalCartItems:string=bucketView.totalItems;
    bucketView.totalItems= (parseInt(bucketView.totalItems)-parseInt(this.productSelectViewMap.get(productId).itemCount)).toString();
    
    this.productSelectViewMap.delete(productId);
    bucketView.productSelectViewMap=this.productSelectViewMap;
   
    localStorage.setItem("BucketItemView",this.ObjectToJsonString(bucketView));
    this.bucketViewEmitter.emit(bucketView)
  }



  }



 }


selectChange(selectedValue)
{
alert(selectedValue)
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



}

 








