import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category';
import { SubCategory } from '../category/sub-category';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {

  public categoryList:Category[];
  public categoryListAll:Category[];
  public sub_categoryList:SubCategory[];
  constructor(private categoryService: CategoryService,private router:Router) {

   
   }


   
  ngOnInit() {
   
   
    

  }

  searchProduct(regForm:NgForm)
  {
    var productSearch=regForm.controls.search.value;
    if(productSearch!='')
    this.router.navigate(['product-name'],{ queryParams: { productName: productSearch } });
  
  }

  mouse_event()
  {
  
    this.categoryService.getCategories().subscribe(response =>
      {
       
        this.categoryList = response;
        console.log('Category From DB')
       
      });
      
      
    return this.categoryList;
  
  }

  mouse_event_sub(categoryId)
  {
    console.log(categoryId)
    this.categoryService.getSubCategories(categoryId).subscribe(response =>
      {
       
      
        this.sub_categoryList = response;
        console.log('SubCategory From DB')
       
        
       
      });
      
      
    return this.sub_categoryList;
  }

 
 

}
