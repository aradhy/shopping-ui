import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { SingleProductViewComponent } from './single-product-view/single-product-view.component';
import { CategoryComponent } from './category/category.component';
import { UserComponent } from './user/user.component';



export const routes: Routes = [
  { path: 'product/cat/:id', component: ProductComponent },
  {path:"product/sub/:id",component: ProductComponent},
  {path:"product-name",component: ProductComponent},
  {path:'single-product-view/:code', component: SingleProductViewComponent},
  {path:'category-view', component: CategoryComponent},
  { path: 'user/:id', component: UserComponent }

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
  




 }



