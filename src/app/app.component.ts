import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieBucket } from './menus/bucketcookie';
import { Product } from './product/product';






@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MyFirstApp';
  bucketView:CookieBucket;
  customerName:string;
  productFullInfoBucketMap:Map<string,Product>;
  
  constructor(private router:Router)
  {

  }
  
  ngOnInit() {
  
    this.router.navigateByUrl('/category-view');
   
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
