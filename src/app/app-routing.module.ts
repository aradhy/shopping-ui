import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent_Menu } from './app_menu/app_menu.component';
import { ProductComponent } from './app_menu/product/product.component';
import { CategoryComponent } from './app_menu/category/category.component';
import { SingleProductViewComponent } from './app_menu/single-product-view/single-product-view.component';
import { MenusComponent } from './app_menu/menus/menus.component';
import { UserComponent } from './app_menu/user/user.component';
import { CheckOutViewComponent } from './app_menu/check-out-view/check-out-view.component';
import { AddressComponent } from './app_menu/address/address.component';



export const routes: Routes = [
  { path: 'product/cat/:catId', component: ProductComponent },
  {path:"product/cat/:catId/sub/:subId",component: ProductComponent},
  {path:"product-name",component: ProductComponent},
  {path:'single-product-view/:code', component: SingleProductViewComponent},
  {path:'category-view', component: CategoryComponent},
  { path: 'user/:id', component: UserComponent },
  { path: 'checkout', component: CheckOutViewComponent },
  { path: 'menu', component: MenusComponent },
  {path:'address',component:AddressComponent},
  {path:'',component:AppComponent_Menu},
  {path:'appChild',component:AppComponent_Menu}
  
  

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
  




 }



