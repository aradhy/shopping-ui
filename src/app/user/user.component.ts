import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  baseUrl: string = 'http://localhost:8090/user';
  httpClient:HttpClient;
  signUpForm:FormGroup;
  firstName:String="";
  lastName:String="";
  email:String="";


 
  constructor(private formBuilder :FormBuilder,httpClient:HttpClient) {
  this.signUpForm=formBuilder.group({
  firstName: new FormControl(),
  lastName:  new FormControl(),
  email: new FormControl()
});
this.httpClient=httpClient;
   }

  ngOnInit() {
  }

  onSubmit(signUpForm:any)
  {
    alert(" Inside Submit....")
    this.firstName=signUpForm.controls.firstName.value;
    this.lastName=signUpForm.controls.lastName.value;
    this.email=signUpForm.controls.email.value;
    
    this.httpClient.post(this.baseUrl,
    {
      "firstName":  this.firstName,
      "lastName":  this.lastName,
      "email":  this.email
      }
    ).subscribe(
      data  => {
      console.log("POST Request is successful ", data);
      },
      error  => {
      
      console.log("Error", error);
      
      }
      
      );
   alert("Request Completeted!");
  }
}

