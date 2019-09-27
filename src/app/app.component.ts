import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieBucket } from './app_menu/menus/bucketcookie';
import { CustomerOrder } from './app_menu/customerorder';
import { Product } from './app_menu/product/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'Address';
  bucketView:CookieBucket;
  customerName:string; 
  productFullInfoBucketMap:Map<string,Product>;
  order:CustomerOrder; 

  constructor(private router:Router,private activatedRoute:ActivatedRoute)
  {

  }
  ngOnInit() {
  
         this.router.navigateByUrl('/appChild');
    
  }

 
}
