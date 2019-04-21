import { Component, OnInit, EventEmitter } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product';
import { Router,ActivatedRoute } from '@angular/router';
import {Output} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductSelect } from './productselectview';
import { TestBed } from '@angular/core/testing';

declare var custom:any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers:[ProductService]
})

export class ProductComponent implements OnInit {
 
  @Output() totalItems: EventEmitter<String> = new EventEmitter(); 
 public productList:Product[];

 public name:String;
 url:string;
 id:string;

 productIdCount:number;


 

  constructor(private productService: ProductService,private activatedRoute:ActivatedRoute,private router:Router) {


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
 
   addToCart(productId:any,cartItemToAdd:any,availQuantPrice:any)
  {
    
alert(availQuantPrice)
   var singleProductItemCount=localStorage.getItem(productId);
   var totalCartItems=localStorage.getItem("totalCardItems");
   if(singleProductItemCount==null && totalCartItems==null)
   {
      localStorage.setItem(productId,cartItemToAdd);
      localStorage.setItem("totalCardItems",cartItemToAdd)
   }
   else{
   if(singleProductItemCount==null)
   {
     localStorage.setItem(productId,cartItemToAdd);
   }
    localStorage.setItem(productId,(parseInt(cartItemToAdd)+parseInt(localStorage.getItem(productId))).toString());
    localStorage.setItem("totalCardItems",(parseInt(totalCartItems)+parseInt(cartItemToAdd)).toString());

   }
 
   this.totalItems.emit(localStorage.getItem("totalCardItems"));

  }
  removeFromCart(productId:any,cartItemToAdd:any,availQuantPrice:any)
  {
    
   var singleProductItemCount=parseInt(localStorage.getItem(productId));

    var totalCartItems=parseInt(localStorage.getItem("totalCardItems"));
   
 if(singleProductItemCount!=null && singleProductItemCount>0 && totalCartItems>=singleProductItemCount) 
 {
  localStorage.setItem(productId,'0');
  localStorage.setItem("totalCardItems",(totalCartItems-singleProductItemCount).toString());
   this.totalItems.emit(localStorage.getItem("totalCardItems"));
  }
 }


selectChange(selectedValue)
{
alert(selectedValue)
}





}

 








