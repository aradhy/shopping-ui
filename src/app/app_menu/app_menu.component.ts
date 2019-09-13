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






@Component({
  selector: 'app_menu-root',
  templateUrl: './app_menu.component.html',
  styleUrls: ['./app_menu.component.css']
})
export class AppComponent_Menu {
  
  
  ngOnInit() {
 
  }
  
  


  
}
