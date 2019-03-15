import { Component, OnInit } from '@angular/core';
import {CategoryService} from './category.service'
import { Category } from './category';
import { SubCategory } from './sub-category';





@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers:[CategoryService]
})
export class CategoryComponent implements OnInit {
  public categoryList:Category[];
  public sub_categories=[{id:1,name:'soap'},{id:2,name:'Detergent'}];
  public sub_categoryList:SubCategory[];
  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
   
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
    this.categoryService.getSubCategories(categoryId).subscribe(response =>
      {
       
        this.sub_categoryList = response;
        console.log('SubCategory From DB')
        //alert(this.sub_categoryList);
       
      });
      
    
    return this.sub_categoryList;
  }
  
}
