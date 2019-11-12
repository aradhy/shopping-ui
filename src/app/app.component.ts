import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieBucket } from './menus/bucketcookie';
import { Product } from './product/product';
import { CustomerOrder } from './customerorder';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ProductService } from './product/product.service';
import { OrderStatus } from './orderstatus';
import { OrderItem } from './orderitem';
import { Location } from '@angular/common';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  [x: string]: any;
  title = 'MyFirstApp';
  bucketView:CookieBucket;
  customerName:string; 
  productFullInfoBucketMap:Map<string,Product>;
  order:CustomerOrder; 
  route: string;
  navigationState: boolean = false;



  constructor(private router:Router,private productService: ProductService,private location: Location)
  {

    router.events.subscribe(() => {
    
      if (location.path() != "") {
     
        if (location.path().includes('/delivery')) {
        
          this.navigationState = false;
        } else {
         
          this.navigationState = true;
        }
      }
    });

  }
  


  ngOnInit() {
   
   this.router.navigateByUrl('/category-view');
   
  }
  
  createCustomerOrder()
{
  let order=new CustomerOrder();
  order.id=558
  order.orderDetails='now slee'
    let orderStatus=new OrderStatus();
    orderStatus.status='fin updated';
    order.orderStatusList.push(orderStatus)
   // orderStatus.status='order updated again'
   // orderStatus.order=order
   // order.orderStatusList.push(orderStatus);

   this.order=order;
this.productService.subCall(this.order).subscribe( data=>
  {
 alert(data)
  }
);
;





}



  onActivate(componentReference) {
 
  
    //componentReference.anyFunction();
   if( componentReference.bucketViewEmitter!==undefined)
   {
    componentReference.bucketViewEmitter.subscribe((data) => {
      // Will receive the data from child here 
     
     this.bucketView=data;
    
   })

  
   componentReference.bucketViewEmitter.subscribe((data) => {
    // Will receive the data from child here 
 
   this.productFullInfoBucketMap=data;
  
  
 })
   }
    componentReference.customerNameEmitter.subscribe((data) => {
      // Will receive the data from child here 
     
     this.customerName=data;
    
   })

   
 

}
}
