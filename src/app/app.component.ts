import { Component } from '@angular/core';
import { Router } from '@angular/router';






@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MyFirstApp';
  totalItems:string;
  
  
  constructor(private router:Router)
  {

  }
  
  ngOnInit() {
  
    this.router.navigateByUrl('/category-view');
  }
  
  onActivate(componentReference) {
    console.log(componentReference)
  
    //componentReference.anyFunction();
    componentReference.totalItems.subscribe((data) => {
      // Will receive the data from child here 
    
     this.totalItems=data;
    
   })
 }

}
