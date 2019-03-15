import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers:[ProductService]
})

export class ProductComponent implements OnInit {
  
 public productList:Product[];
 public name:String;
 

  constructor(private productService: ProductService) {


   }
  

  ngOnInit() {
   
 
  }
  
   mouse_event(event)
  {
   
   
   
    this.productService.getProductByCategory(1).subscribe(response =>
      {
       
        this.productList = response;
        console.log('From DB')
       
      });
      
    
    
    
    
    return this.productList;
  
  }

}

 








