import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BucketView } from './menus/bucketview';






@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MyFirstApp';
  bucketView:BucketView;
  selectedMap:Map<string,string>;
  
  constructor(private router:Router)
  {

  }
  
  ngOnInit() {
  
    this.router.navigateByUrl('/category-view');
  }
  
  onActivate(componentReference) {
    console.log(componentReference)
    
    //componentReference.anyFunction();
    componentReference.bucketViewEmitter.subscribe((data) => {
      // Will receive the data from child here 
     
     this.bucketView=data;
    
   })

   componentReference.selectedMapEmitter.subscribe((data) => {
    // Will receive the data from child here 
 
   this.selectedMap=data;
  
 })


   
 }

}
