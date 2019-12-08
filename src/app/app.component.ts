import { Component, ViewChild, OnInit, AfterViewInit,EventEmitter,Output } from '@angular/core';
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
import { GoogleResponse } from './user/model/google-response';
import { TokenDTO } from './user/model/tokendto';
import * as $ from 'jquery';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from "@angular/material/dialog";




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
  currentUserName:string;
  
  @ViewChild(MenusComponent) menusComponent: MenusComponent;
 
  


  constructor(private router:Router,private productService: ProductService,private location: Location,private activatedRoute:ActivatedRoute,private locationStrategy:LocationStrategy,private userService:UserService,private httpClient: HttpClient,private dialog: MatDialog)
  {
   
    router.events.subscribe(() => {
      
      if (location.path() != "") {
     
        if (location.path().includes('/delivery')) {
        
          this.navigationState = false;
        } else {
         
          this.navigationState = true;
        }
      }
    });



  }
  


  ngOnInit() {
   
  
    let userInfo=  JSON.parse(localStorage.getItem("USER"));

    if(localStorage.getItem("USER")!=null)
    {
    
     let tokenExpired= (userInfo.jwtExpiry - (Date.now() / 1000));
      if(userInfo.userName!=null && tokenExpired)
      {
      
          this.currentUserName=userInfo.userName;
          $(".noUser").hide();
          $(".hasUser").show();
      }
     

    }
   
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

  let  socialResponse;

if(this.currentUrl.indexOf('access_token=')>0) 
{

  let access_token= this.getResponseFromUrl(this.currentUrl,"access_token")
  let provider=localStorage.getItem('PROVIDER')
  if(provider=='facebook')
  {
    
    $(".noUser").hide();
   
   this.userService.getFaceBookResponse(access_token).subscribe(data=>{
 
    this.currentUserName=data.name

  
    socialResponse =new FacebookResponse(access_token,data.name,data.email,'facebook')
    let tokenDTO=new TokenDTO()
    tokenDTO.jwtToken=access_token;
    tokenDTO.provider=provider
    tokenDTO.userName=this.currentUserName
    tokenDTO.jwtExpiry=data.jwtExpiry
    localStorage.setItem("USER",JSON.stringify(tokenDTO))
    this.userService.socialSignUp(socialResponse);
  
   
    window.history.pushState(this.currentUrl,'','https://localhost:4200/')
   
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
   
    resp=part.substring((param+"=").length+part.indexOf(param+"="),part.length)
    return resp
	}
  });
  
  return resp;
  
}

openDialog(id)
{
 
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = false;
  dialogConfig.height="520px"
  dialogConfig.width="320px"
  dialogConfig.data =id;

let dialogRef= this.dialog.open(UserComponent,dialogConfig);
   
  
}

logOut()
{
  this.currentUserName=null;
  localStorage.setItem('USER',null)
 
    $(".noUser").show();
    $(".hasUser").hide();
  
}

}

