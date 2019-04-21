import { Component, OnInit, Output,EventEmitter, ViewChild } from '@angular/core';
import {CategoryService} from './category.service'
import { Category } from './category';
import { SubCategory } from './sub-category';
import { NgbCarouselConfig, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';







@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers:[CategoryService,Category,SubCategory, NgbCarouselConfig,NgbCarousel]
})
export class CategoryComponent implements OnInit {
 
  @ViewChild('myCarousel')  myCarousel:NgbCarousel
  public categoryList:Category[];
  public categoryListAll:Category[];
  public sub_categoryList:SubCategory[];
  constructor(private categoryService: CategoryService,config: NgbCarouselConfig, myCarousel:NgbCarousel) {
    config.interval = 9000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationIndicators=false;
   this.myCarousel=myCarousel;
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


tellMeTheSlide(x)
{
  
 // alert("Active==" +this.myCarousel.activeId)
  this.myCarousel.select(x);

}

  
}




