import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import {CategoryService} from './category.service'
import { Category } from './category';
import { SubCategory } from './sub-category';








@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers:[CategoryService,Category,SubCategory]
})
export class CategoryComponent implements OnInit {
 

  public categoryList:Category[];
  public categoryListAll:Category[];
  public sub_categoryList:SubCategory[];
  constructor(private categoryService: CategoryService) {

   
   }


   
  ngOnInit() {
    this.categoryListAll=this.categoriesOnload();
   
    

  }

  
 


categoriesOnload()
{
  this.categoryService.getCategoriesAll().subscribe(response =>
    {
    
      this.categoryListAll = response;
      console.log('All Category From DB')
     
      for (var i = 0; i < this.categoryListAll.length; i++) {
       
        console.log("Inside sub "+this.categoryListAll[i].name)
        console.log("Inside sub "+this.categoryListAll[i].subCategory)
        this.categoryListAll[i].imageLink="images//"+this.categoryListAll[i].imageLink;
   
      }
     
    });
    
  
  return this.categoryListAll;
}




  
}




