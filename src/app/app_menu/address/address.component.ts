import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../user/model/token-Response';
import * as $ from 'jquery';
import { Address } from './address';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  
  addressForm:FormGroup;
  
addressList:Array<Address>=[];
  constructor(formBuilder:FormBuilder,private httpClient: HttpClient) {
    this.addressForm=formBuilder.group({
      name: new FormControl(),
      address:new FormControl(),
       email: new FormControl(),
       city: new FormControl(),
       state: new FormControl(),
       landMark: new FormControl(),
       houseNo:new FormControl()
    });

   }

  ngOnInit() {
  }

  showForm()
  {
    $("#addrFormId").show();
  }
  onSubmitAddress(addressForm:any)
  {    
    let addressModel=new Address()
    addressModel.name=addressForm.controls.name.value;
    addressModel.email=addressForm.controls.email.value;
    addressModel.addressDetails=addressForm.controls.address.value;
    addressModel.city=addressForm.controls.city.value;
    addressModel.state=addressForm.controls.state.value;
    addressModel.houseNo=addressForm.controls.houseNo.value;
    addressModel.landmark=addressForm.controls.landMark.value;
    this.addressForm.reset();
   
  this.addressList.push(addressModel)
    $("#addrFormId").hide();
    /*this.httpClient.post<TokenResponse>("http://localhost:8080/addressDetails", {
      "name": name,
      "address":address,
      "email":  email,
      "city": city,
      "state":state,
      "houseNo":houseNo,
      "landmark":landmark

    }
   
    ).subscribe(
      tokenResponse  => {
     if(tokenResponse.code==201)
     {
        alert('Address Added Successfully')
     }
     

   
      
 }); */

}
      
}
