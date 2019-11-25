import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormControl, FormGroup, Validators,EmailValidator } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {TokenResponse} from './model/token-Response'
import { GoogleResponse } from './model/google-response';
import { FacebookResponse } from './model/facebook-response';
import { GoogleLoginProvider, FacebookLoginProvider, AuthService } from 'angularx-social-login';
import { APP_BASE_HREF } from '@angular/common';
import * as $ from 'jquery';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
declare var onClickSubmit:any;
declare var onClick:any;
@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})


export class UserComponent implements OnInit {
  signUpForm:FormGroup;
  signInForm:FormGroup;
  paramVal:string;
  @Output() customerNameEmitter = new EventEmitter<string>();
  currentUrl:string;
  currentUserName:string;

  constructor(private router:Router,private activatedRoute:ActivatedRoute,formBuilder:FormBuilder,private httpClient: HttpClient,private authService: AuthService,private dialogRef: MatDialogRef<UserComponent>,@Inject(MAT_DIALOG_DATA) public data: any) 
  {  

    
    this.signUpForm=formBuilder.group({
      name: new FormControl('',Validators.required),
      mobile:new FormControl('',Validators.required),
       email: new FormControl('',[Validators.required, Validators.email]),
       password: new FormControl('',Validators.required)
    });
   
    this.signInForm=formBuilder.group({
    
      mobileOrEmail: new FormControl(),
       password: new FormControl()
    });
  
    
  }


  ngOnInit() {

 
    this.activatedRoute.params.subscribe(params => {
      this.paramVal = params.id; 
    
    });

    this.onClickSubmit(this.data);
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.signUpForm.controls[controlName].hasError(errorName);
  }

  changeForm(paramVal)
  {
    this.paramVal=paramVal
    this.onClick(this.paramVal);
  }
  close()
  {
    this.dialogRef.close();
    this.router.navigateByUrl('/category-view');
  }


  onSignUp(signUpForm:any)
  {    
   
   let name=signUpForm.controls.name.value;
    let mobileNumber=signUpForm.controls.mobile.value;
    let email=signUpForm.controls.email.value;
    let password=signUpForm.controls.password.value;
    signUpForm.reset();

    console.log(name)
    console.log(mobileNumber)
  /*  this.httpClient.post<TokenResponse>("http://localhost:8080/signUp", {
      "name": name,
      "mobileNumber":mobileNumber,
      "email":  email,
      "password": password

    }
   
    ).subscribe(
      tokenResponse  => {
     
       if(tokenResponse.obj!=null && tokenResponse.obj.jwtToken!=null && tokenResponse.obj.csrfToken!=null )
           {
             if(tokenResponse.obj.userName!=null)
             {
             alert("Welcome  "+tokenResponse.obj.userName)
             this.customerNameEmitter.emit(tokenResponse.obj.userName)
             localStorage.setItem("customerName",tokenResponse.obj.userName)
              localStorage.setItem("JWT-TOKEN",tokenResponse.obj.jwtToken)
              localStorage.setItem("X-CSRF-TOKEN",tokenResponse.obj.csrfToken)
              this.router.navigateByUrl("/");

             }
           }
     else{
       alert(tokenResponse.message)
     }

   
      
 }); */

}
      

      onSignIn(signInForm:any)
      {
        let baseUrl = 'http://localhost:8080/signIn'
        let mobileOrEmail=signInForm.controls.mobileOrEmail.value;
        let password=signInForm.controls.password.value;
        signInForm.controls.password.reset()
       
      
        this.httpClient.post<TokenResponse>( baseUrl,
          {
            "mobileOrEmail":  mobileOrEmail,
            "password":password
      
          }
        ).subscribe(
          tokenResponse  => {
            localStorage.setItem("JWT-TOKEN",tokenResponse.obj.jwtToken)
          if(tokenResponse.obj!=null && tokenResponse.obj.jwtToken!=null && tokenResponse.obj.csrfToken!=null )
           {
            if(tokenResponse.obj.userName!=null)
            {
              this.customerNameEmitter.emit(tokenResponse.obj.userName)
              localStorage.setItem("customerName",tokenResponse.obj.userName)
            alert("Welcome  "+tokenResponse.obj.userName)
            }
              localStorage.setItem("JWT-TOKEN",tokenResponse.obj.jwtToken)
              localStorage.setItem("X-CSRF-TOKEN",tokenResponse.obj.csrfToken)

            
           }else{
            alert(tokenResponse.message)
          }
          
          this.router.navigateByUrl('/category-view');
     },
     error => {
       alert("Bhai error aa gayee")
     }); 
    
    }



onClickSubmit(id)
{

  $("#"+id).show();
if(id=='signUpId')
{

  $(".Up").css({"border-bottom": "3px solid blue"})
$("#signInId").hide();
}
else{
  
  $(".In").css({"border-bottom": "3px solid blue"})
    $("#signUpId").hide();
}
}

 onClick(id)
{

if(id=='signUp')
{
  $(".Up").css({"border-bottom": "3px solid blue"})
  $(".In").css({"border-bottom":"none"})
$("#signUpId").show();
$("#signInId").hide();
}
else{

  $(".In").css({"border-bottom": "3px solid blue"})
  $(".Up").css({"border-bottom":"none"})
    $("#signInId").show();
    $("#signUpId").hide();
}
}
    


 
faceBookLogin()
{
  this.currentUserName=localStorage.getItem('currentUser');
  if(this.currentUserName==null || this.currentUserName=="null")
  window.location.href= "https://www.facebook.com/dialog/oauth?client_id=2190645354387980&redirect_uri=https://localhost:4200/&scope=email&response_type=token"
}


googleLogin()
{
  
  this.currentUserName=localStorage.getItem('currentUser');
  if(this.currentUserName==null || this.currentUserName=="null")
  window.location.href="https://accounts.google.com/o/oauth2/auth?scope=email&redirect_uri=https://localhost:4200/&response_type=code&client_id=517977997834-kevh4fjm6um2roe04umom1h7mki74rtv.apps.googleusercontent.com&state=af0ifjsldk"
}
 
  



}



