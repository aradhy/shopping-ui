import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieBucket } from './menus/bucketcookie';
import { Product } from './product/product';
import { CustomerOrder } from './customerorder';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { MenusComponent } from './menus/menus.component';
import { CategoryComponent } from './category/category.component';







@Component({
  selector: 'app_menu-root',
  templateUrl: './app_menu.component.html',
  styleUrls: ['./app_menu.component.css']
})
export class AppComponent_Menu {
  
  @ViewChild(CategoryComponent)
  private catComp:CategoryComponent
  ngOnInit() {
 
  }

  searchParent(search:any)
  {
   this.catComp.fetchCategorySubCategory(search);
  }
}
