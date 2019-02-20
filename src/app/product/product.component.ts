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

 public product:Product;
 public name:String;

  constructor(private productService: ProductService) {
alert('hello');

   }
  

  ngOnInit() {
    this.productService.getProductByCode(1).subscribe(response =>
    {
      this.product = response;
     //this.name= this.product.getName();
      
      alert("my request got completed"+this.product);
     
    });
 
  }

 







}
