import { Component, OnInit, EventEmitter } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product';
import { Router,ActivatedRoute } from '@angular/router';
import {Output} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductSelect } from './productselectview';

import { CookieService } from 'ngx-cookie-service';
declare var custom:any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers:[ProductService,CookieService ]
})

export class ProductComponent implements OnInit {
 
  @Output() totalItems: EventEmitter<String> = new EventEmitter(); 
 public productList:Product[];

 public name:String;
 url:string;
 id:string;

 productIdCount:number;


 

  constructor(private productService: ProductService,private activatedRoute:ActivatedRoute,private router:Router,private cookieService:CookieService ) {
  
  }

  ngOnInit() {
  

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
   if(!(this.cookieService.check("totalCardItems")))
   {
  
    this.cookieService.set("totalCardItems","0")
    var totalCartItems='0';
    
   }

   if(!(this.cookieService.check(productId)))
   {

    var  productSelectItemNew=new ProductSelect();
    productSelectItemNew.setCode(productId)
    productSelectItemNew.setQuantity(selectedQuant);
    productSelectItemNew.setItemCount(itemCount);
    this.cookieService.set(productId,JSON.stringify(productSelectItemNew));
   var totalCartItems=this.cookieService.get("totalCardItems");
   }
  else{
  
    var singleProductItem= this.cookieService.get(productId);
   var totalCartItems=this.cookieService.get("totalCardItems");
    var productItem=JSON.parse(singleProductItem);
    var newCount=(parseInt(itemCount)+parseInt(productItem.itemCount)).toString();
    productItem.itemCount =newCount;
    
    this.cookieService.set(productId,JSON.stringify(productItem));
    }
  
    this.cookieService.set("totalCardItems",(parseInt(totalCartItems)+parseInt(itemCount)).toString());
   
    this.totalItems.emit(this.cookieService.get("totalCardItems"))

  }
  removeFromCart(productId:any,quantity:any)
  {
 
 if(this.cookieService.check(productId) && this.cookieService.check("totalCardItems"))
 {

  var singleProductItem=this.cookieService.get(productId);
  var totalCartItems= parseInt(this.cookieService.get("totalCardItems"));
  var singleProductItemCount=parseInt(JSON.parse(singleProductItem).itemCount);

  this.cookieService.delete(productId)
  this.cookieService.set("totalCardItems",(totalCartItems-singleProductItemCount).toString());
  this.totalItems.emit(this.cookieService.get("totalCardItems"));
  }

  if(!this.cookieService.check("totalCardItems"))
  this.totalItems.emit("0");
  else
  this.totalItems.emit(this.cookieService.get("totalCardItems"))
 }


selectChange(selectedValue)
{
alert(selectedValue)
}





}

 








