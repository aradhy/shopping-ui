import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { UserComponent } from './user/user.component';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LoginOpt } from 'angularx-social-login';
import { TokenInterceptor } from './token-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    CategoryComponent,
    SingleProductViewComponent,
    MenusComponent,UserComponent
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,NgbModule,CommonModule, BrowserAnimationsModule,MatGridListModule,NgxImageZoomModule,SocialLoginModule
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
