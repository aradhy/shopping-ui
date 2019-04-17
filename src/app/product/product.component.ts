import { Component, OnInit, EventEmitter } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product';
import { Router,ActivatedRoute } from '@angular/router';
import {Output} from '@angular/core';


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
       
      });
      
    
    
    
    
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

   addToCart()
  {
 this.totalItems.emit(sessionStorage.getItem("totalCardItems"));

  }
  removeFromCart(productId)
  {
    
    var totalCount=parseInt(localStorage.getItem("totalCardItems")) -1;
    localStorage.setItem("totalCardItems",totalCount.toString());
  
  }
}

 








