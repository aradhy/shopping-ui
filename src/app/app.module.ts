import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { HttpClientModule } from '@angular/common/http';
import { UserComponent } from './user/user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from './category/category.component';
import { SingleProductViewComponent } from './single-product-view/single-product-view.component';
import { MenusComponent } from './menus/menus.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedService } from './sharedservice.service';
import {MatGridListModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import * as $ from "jquery";

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    UserComponent,
    CategoryComponent,
    SingleProductViewComponent,
    MenusComponent
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,NgbModule,CommonModule, BrowserAnimationsModule,MatGridListModule,NgxImageZoomModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
