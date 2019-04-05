import { Component, OnInit } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product';
import { Router,ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers:[ProductService]
})

export class ProductComponent implements OnInit {
  
 public productList:Product[];
 public name:String;
 id:string;

  constructor(private productService: ProductService,private activatedRoute:ActivatedRoute,private router:Router) {


   }
  

 

  ngOnInit() {
    this.id=this.activatedRoute.snapshot.params.id;
    alert(this.activatedRoute.snapshot.params.id)
    
 }
  
   productBasedOnCategory()
  {
   
    this.id=this.activatedRoute.snapshot.params.id;
   
    this.productService.getProductByCategory(this.id).subscribe(response =>
      {
       
        this.productList = response;
        console.log('Products based on Category From DB')
       
      });
      
    
    
    
    
    return this.productList;
  
  }

}

 








