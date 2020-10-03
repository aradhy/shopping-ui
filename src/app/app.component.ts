import { Component, ViewChild, OnInit, AfterViewInit,EventEmitter,Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from './product/Product';
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
import { TokenResponse } from './user/model/TokenResponse';
import { UserService } from './user/user-service';
import { UserComponent } from './user/user.component';
import { GoogleResponse } from './user/model/google-response';
import { TokenDTO } from './user/model/tokendto';
import * as $ from 'jquery';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { FilterComponent } from './filter/filter.component';
import { AppService } from './app-service';
import { CookieBucket } from './menus/bucketcookie';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit{
  ngAfterViewInit(): void {
    this.logIn();
    this.router.navigateByUrl('/category-view');
   
  }
 
  
  [x: string]: any;
  title = 'MyFirstApp';
  bucketView:CookieBucket;
  customerName:string; 
  productFullInfoBucketMap:Map<string,Product>;
  order:CustomerOrder; 
  route: string;
  navigationState: boolean = false;
  checkout:boolean=true;
  currentUserName:string;
  rest:boolean;
  @ViewChild(MenusComponent) menusComponent: MenusComponent;
  
  


  constructor(private router:Router,private appService:AppService,private location: Location,private activatedRoute:ActivatedRoute,private locationStrategy:LocationStrategy,private userService:UserService,private httpClient: HttpClient,private dialog: MatDialog)
  {
  
    router.events.subscribe(() => {
 
     if (location.path() != "") {
     if(location.path() !="/category-view")
     {
        
        if (location.path().includes('/delivery') ) {
        
          this.navigationState = false;
        } 
       
        else {
         
          this.navigationState = true;
        }
       
        if(location.path().includes('/checkout') || location.path().includes('/delivery'))
        {
           this.checkout=false;
        }
        else{
          this.checkout=true;
        }
      }
      else{
        this.checkout=true;
      }
      } 
     
  
   
      
    });



  }
  

  test()
  {
    let map1:Map<string, number> = new Map([["a", 1], ["b", 2]]);
let map2:Map<string, number> = new Map([["b", 1], ["d", 2]]);

let mergedMap:Map<string, number> = new Map([...Array.from(map1.entries()), ...Array.from(map2.entries())]);
//alert('new Map')
console.log(mergedMap)
  }

  ngOnInit() {
 
//this.test();


    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
  
    if(this.appService.checkForNullONullString(localStorage.getItem("USER")))
    {
      
    let userInfo=  JSON.parse(localStorage.getItem("USER"));
    if(userInfo.jwtExpiry!=null)
    {
     let tokenExpired= (userInfo.jwtExpiry - (Date.now() / 1000));
    }
    
      if(userInfo.userName!=null)
      {
      
          this.currentUserName=userInfo.userName;
         
          $(".noUser").hide();
          $(".hasUser").show();
      }
     

    }
  
    this.router.navigateByUrl('/');
    
   
  }
  
 

  close() {
    this.dialogRef.close();
  }

  onActivate(componentReference) {

    window.scroll(0,0);
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

  let  socialResponse;

if(this.currentUrl.indexOf('access_token=')>0) 
{

  let access_token= this.getResponseFromUrl(this.currentUrl,"access_token")
  let provider=localStorage.getItem('PROVIDER')
  if(provider=='facebook')
  {
    
    $(".noUser").hide();
   
   this.userService.getFaceBookResponse(access_token).subscribe(data=>{
 
   // this.currentUserName=data.name

  
    socialResponse =new FacebookResponse(access_token,data.name,data.email,'facebook')
    let tokenDTO=new TokenDTO()
    tokenDTO.jwtToken=access_token;
    tokenDTO.provider=provider
    tokenDTO.userName=this.currentUserName
    tokenDTO.jwtExpiry=data.jwtExpiry
    localStorage.setItem("USER",JSON.stringify(tokenDTO))
    this.userService.socialSignUp(socialResponse);
  
   
   
   
   }
 
   )
  }
    else if(provider=='google')
    { 
      $(".noUser").hide();
         this.userService.getGoogleResponse(access_token).subscribe(data=>{  
         
        
         this.currentUserName=data.name
         socialResponse=new GoogleResponse(access_token,data.name,data.email,'google')
         let tokenDTO=new TokenDTO()
         tokenDTO.jwtToken=access_token;
         tokenDTO.provider=provider
         tokenDTO.userName=this.currentUserName
         tokenDTO.jwtExpiry=data.jwtExpiry
         localStorage.setItem("USER",JSON.stringify(tokenDTO))
         this.userService.socialSignUp(socialResponse);
         
        
        
        
      }  
      )
     
    }
    localStorage.removeItem('PROVIDER')

}
}

getResponseFromUrl(url,param) {
 
  var query = decodeURIComponent(url)
 var resp="";
  query.split("&").forEach(function(part) {
   if(part.indexOf(param+"=")>=0)
	{
   
    resp=part.substring((param+"=").length+part.indexOf(param+"="),part.length)
    return resp
	}
  });
  
  return resp;
  
}



openDialog(id)
{
 let  dialogRef=  this.appService.openDialog(id)
   dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed', result);
    this.currentUserName = result.data;
    
   if(this.currentUserName!=null)
   {
    $(".noUser").hide();
    $(".hasUser").show();
   }
  }); 
}

fetchUserNameFromMenuComp($event:any)
{
  this.currentUserName=$event;
}


logOut()
{
 // this.currentUserName=null;
  localStorage.setItem('USER',null)
    window.location.href='https://localhost:4200/'
}


}

