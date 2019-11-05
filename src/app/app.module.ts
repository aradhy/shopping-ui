import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatGridListModule, MatRadioButton, MatRadioModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { AppComponent } from './app.component';
import { AppComponent_Menu } from './app_menu/app_menu.component';
import { ProductComponent } from './app_menu/product/product.component';
import { CategoryComponent } from './app_menu/category/category.component';
import { SingleProductViewComponent } from './app_menu/single-product-view/single-product-view.component';
import { MenusComponent } from './app_menu/menus/menus.component';
import { UserComponent } from './app_menu/user/user.component';
import { CheckOutViewComponent } from './app_menu/check-out-view/check-out-view.component';
import { DeliveryComponent } from './app_menu/delivery/delivery.component';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, LoginOpt } from 'angularx-social-login';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SharedService } from './app_menu/sharedservice.service';
import { TokenInterceptor } from './app_menu/token-interceptor';
import { FilterComponent } from './filter/filter.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    AppComponent,AppComponent_Menu,  ProductComponent,
    CategoryComponent,
    SingleProductViewComponent,
    MenusComponent,UserComponent, CheckOutViewComponent, DeliveryComponent, FilterComponent  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,NgbModule,CommonModule, BrowserAnimationsModule,MatGridListModule,NgxImageZoomModule,SocialLoginModule,
    MatAutocompleteModule,MatProgressSpinnerModule,MatRadioModule
  ],
  providers: [SharedService,{
    provide: AuthServiceConfig,
    useFactory: provideConfig
  },SocialLoginModule,{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
 
};

const faceBookLoginOptions: LoginOpt = {
  enable_profile_selector:true
 
};
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("517977997834-kevh4fjm6um2roe04umom1h7mki74rtv.apps.googleusercontent.com",googleLoginOptions),
   
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("2190645354387980",faceBookLoginOptions)
  }
]);

export function provideConfig() {
  return config;
}
