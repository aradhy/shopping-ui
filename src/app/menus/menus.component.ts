import { Component, OnInit, Input } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category';
import { SubCategory } from '../category/sub-category';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css'],
  providers:[CookieService ]
})
export class MenusComponent implements OnInit {
  @Input() totalItems: string;
  public categoryList:Category[];
  public categoryListAll:Category[];
  public sub_categoryList:SubCategory[];
  totalBucketItems:string[]=['1','2','3','4']
  

  constructor(private categoryService: CategoryService,private router:Router,private cookieService:CookieService) {
   
   
   }


   
  ngOnInit() {
   alert(this.cookieService.check("totalCardItems"))

if(isNaN(parseInt(this.cookieService.get("totalCardItems"))) || (!this.cookieService.check("totalCardItems")))
{

 
  this.totalItems="0";
    

  }
else{
  var totalCartItemCount=this.cookieService.get('totalCardItems');
  this.totalItems=totalCartItemCount;
}

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

removeFromBucket(x:string)
{
 
  this.totalBucketItems= this.totalBucketItems.filter(item => {
  return  item !=x;
  })

 
}
 

}
