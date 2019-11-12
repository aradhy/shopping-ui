import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { SingleProductViewComponent } from './single-product-view/single-product-view.component';
import { CategoryComponent } from './category/category.component';
import { UserComponent } from './user/user.component';
import { MenusComponent } from './menus/menus.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { CheckOutViewComponent } from './check-out-view/check-out-view.component';




export const routes: Routes = [
  {path:"product/cat",component: ProductComponent},
  {path:"product-name",component: ProductComponent},
  {path:'single-product-view/cat/:catId/sub/:subId/pc/:code/avail/:prodAvailId', component: SingleProductViewComponent},
  {path:'category-view', component: CategoryComponent},
  { path: 'user/:id', component: UserComponent },
  {path:'delivery',component:DeliveryComponent},
  { path: 'menu', component: MenusComponent },
  {path:'checkout',component:CheckOutViewComponent}
  

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
  




 }



