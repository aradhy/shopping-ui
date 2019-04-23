import { Component, OnInit, Output,EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import {CategoryService} from './category.service'
import { Category } from './category';
import { SubCategory } from './sub-category';
import { NgbCarouselConfig, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import {Slider} from './slider';


declare var custom:any;


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers:[CategoryService,Category,SubCategory, NgbCarouselConfig,NgbCarousel]
})
export class CategoryComponent implements OnInit,AfterViewInit {
  ngAfterViewInit(): void {
    custom(0,1);
  }
 
  @ViewChild('myCarousel')  myCarousel:NgbCarousel
  public categoryList:Category[];
  public categoryListAll:Category[];
  public sub_categoryList:SubCategory[];
  public sliderList:Slider[] = [
    {id: '55',name:'Summer Sale',imageLink:'images\\summer-sale.jpg'},
    {id: '56',name:'Gym Shaker',imageLink:'images\\gym-shaker.jpg'},
    {id: '57',name:'Cleaners Tissue',imageLink:'images\\cleaners-tissue.jpg'},
  
  ];
  
  constructor(private categoryService: CategoryService,config: NgbCarouselConfig, myCarousel:NgbCarousel) {
    config.interval = 9000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationIndicators=false;
   this.myCarousel=myCarousel;
   }
   onSlideChanged(ev)
   {
     
custom(ev.current,ev.prev);

   }

   
  ngOnInit() {
    this.categoryListAll=this.categoriesOnload();
    custom(0,1);
    

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
  

  this.myCarousel.select(x);
  
}

  
}




