import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { SingleProductViewComponent } from './product/single-product-view/single-product-view.component';
import { CategoryComponent } from './category/category.component';



export const routes: Routes = [
  { path: 'product/:id', component: ProductComponent },
  {path:'single-product-view', component: SingleProductViewComponent},
  {path:'category-view', component: CategoryComponent}
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
  




 }



