import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product';



@Component({
  selector: 'app-single-product-view',
  templateUrl: './single-product-view.component.html',
  styleUrls: ['./single-product-view.component.css']
})
export class SingleProductViewComponent implements OnInit {

  product:Product ;
  code:string;

  constructor(private productService: ProductService,private activatedRoute:ActivatedRoute,private router:Router) {


  }

  ngOnInit() {
    {
   
      this.activatedRoute.params.subscribe(routeParams => {
        alert(routeParams.code)
        this.code=routeParams.code;
        this.productService.productBasedOnCode(this.code).subscribe(response =>
          {
           
            this.product = response;
            console.log('Product based on Id From DB')
           
          });
      });
  }

}
 

}
