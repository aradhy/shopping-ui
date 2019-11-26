import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieBucket } from './menus/bucketcookie';
import { Product } from './product/product';
import { CustomerOrder } from './customerorder';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ProductService } from './product/product.service';
import { OrderStatus } from './orderstatus';
import { OrderItem } from './orderitem';
import { Location } from '@angular/common';
import {LocationStrategy} from '@angular/common';
import { FacebookResponse } from './user/model/facebook-response';
 import { MenusComponent } from './menus/menus.component';
import { logging } from 'protractor';
import { TokenResponse } from './user/model/token-Response';
import { UserService } from './user/user-service';
import { UserComponent } from './user/user.component';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit{
  ngAfterViewInit(): void {
   
    this.logIn();
  }
 
  
  [x: string]: any;
  title = 'MyFirstApp';
  bucketView:CookieBucket;
  customerName:string; 
  productFullInfoBucketMap:Map<string,Product>;
  order:CustomerOrder; 
  route: string;
  navigationState: boolean = false;
  
 
  
  @ViewChild(MenusComponent) menusComponent: MenusComponent; 

  constructor(private router:Router,private productService: ProductService,private location: Location,private activatedRoute:ActivatedRoute,private locationStrategy:LocationStrategy,private userService:UserService,private httpClient: HttpClient)
  {
   
    
  
    router.events.subscribe(() => {
      
      if (location.path() != "") {
       // alert(location.prepareExternalUrl(location.path()));
        if (location.path().includes('/delivery')) {
        
          this.navigationState = false;
        } else {
         
          this.navigationState = true;
        }
      }
    });



  }
  


  ngOnInit() {

     this.router.navigateByUrl('/category-view');
   
  }
  
 

  close() {
    this.dialogRef.close();
  }

  onActivate(componentReference) {
 
  
    //componentReference.anyFunction();
   if( componentReference.bucketViewEmitter!==undefined)
   {
    componentReference.bucketViewEmitter.subscribe((data) => {
      // Will receive the data from child here 
     
     this.bucketView=data;
    
   })

  
   componentReference.bucketViewEmitter.subscribe((data) => {
    // Will receive the data from child here 
 
   this.productFullInfoBucketMap=data;
  
  
 })
   }
    componentReference.customerNameEmitter.subscribe((data) => {
      // Will receive the data from child here 
     
     this.customerName=data;
    
   })

   
 

}


logIn()
{
  this.currentUrl=window.location.href
  let currentUserName=localStorage.getItem('currentUser');
  this.currentUserName=currentUserName;
if((currentUserName==null || currentUserName=="null") && this.currentUrl!='https://localhost:4200/')
{


if(this.currentUrl.indexOf('#access_token=')>0)
{

   //let access_token=this.currentUrl.substring(this.currentUrl.indexOf('#access_token=')+"#access_token=".length,this.currentUrl.indexOf('&'))
 let access_token= this.getResponseFromUrl(this.currentUrl,"access_token")
 alert(access_token)
   this.userService.getFaceBookResponse(access_token).subscribe(data=>{
 
    this.currentUserName=data.name
    let  facebookResponse=new FacebookResponse(access_token,data.name,'facebook')
    facebookResponse.email=data.email
    localStorage.setItem('JWT-TOKEN',access_token)
   
   
    window.history.pushState(this.currentUrl,'','https://localhost:4200/')
   
    localStorage.setItem('currentUser', this.currentUserName)
   
   }
   )
}
else if(this.currentUrl.indexOf('&code=')>0)
{
     
        let code=this.getResponseFromUrl(this.currentUrl,"code")
       
         this.userService.getGoogleResponse(code).subscribe(data=>{    
         localStorage.setItem('currentUser', this.currentUserName)
         localStorage.setItem('JWT-TOKEN',data.idToken)
         window.history.pushState(this.currentUrl,'','https://localhost:4200/')
        
         }  
      )
     

}

}
}

getResponseFromUrl(url,param) {
 
  var query = decodeURIComponent(url)
 var resp="";
  query.split("&").forEach(function(part) {
   if(part.indexOf(param+"=")>=0)
	{
   
    resp=part.substring((param+"=").length,part.length)
    return resp
	}
  });
  
  return resp;
  
}




}
