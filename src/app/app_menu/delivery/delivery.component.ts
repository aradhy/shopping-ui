import { Component, OnInit, Renderer, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../user/model/token-Response';
import * as $ from 'jquery';
import { Address } from './address';

@Component({
  selector: 'app-address',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit,AfterViewInit,AfterContentInit {
  addressForm:FormGroup;
  addressOp='Change Address'
  ngAfterViewInit(): void {
 
  }
  
  ngAfterContentInit():void{
    this.setJs();
  }
 
addNewAddress()
{
  if(this.addressOp=='Change Address')
  {
  this.addressOp="Add Address"
  document.getElementById("addressContentId").style.display='block';
  document.getElementById("addressListId").style.display='block';
  document.getElementById("formId").style.display='none';
  }
  else{
   
    document.getElementById("addressContentId").style.display='block';
    document.getElementById("addressListId").style.display='none';
    document.getElementById("formId").style.display='block';
    document.getElementById("adripd").style.display="none"
    scrollTo(5, 1);
  }
 
}


cancel()
{
  document.getElementById("addressListId").style.display='block';
  
    document.getElementById("adripd").style.display="block"
  document.getElementById("formId").style.display='none';
   this.  addressOp='Change Address'
   scrollTo(5, 1);
  
}
addressList:Array<Address>=[];
  constructor(formBuilder:FormBuilder,private httpClient: HttpClient,private renderer: Renderer, private elem: ElementRef) {
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
    let address=new Address();
    address.name='Sangam Vihar'
    address.city='New Delhi'
    address.country='India'
    address.email='mishra.shiv68@gmail.com'
    address.landmark='Opposite Batra Hospital'
    address.state='Delhi'
    address.addressDetails='Near Radha krishna Mandir'
    this.addressList.push(address)
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
 

setJs()
{
 
  if(this.addressList.length>0)
  {

      this.toggleAddress("collapsible");

      this.toggle("collapsible1");

      this.toggle("collapsible2");
   

  }
    
if(this.addressList.length==0)
{

    document.getElementById('adripd').style.display='none';
    document.getElementById("addressContentId").style.display='block';

    $(".collapsible1").prop('disabled',true);
    $(".collapsible1").css("color","#A9A9A9")

    $(".collapsible2").prop('disabled',true);
    $(".collapsible2").css("color","#A9A9A9")

    $(".do").css("color","#A9A9A9")

    $(".po").css("color","#A9A9A9")

}
else{
     
    $(".collapsible2").prop('disabled',true);
    $(".collapsible2").css("color","#A9A9A9")
    $(".po").css("color","#A9A9A9")
    $(".content-delivery-option").css({ display: "block" });
}



}



proceedToPayment()
{
  $(".po").css("color","black")
  $(".do").css("color","black")
  $(".collapsible1").css("color","black")
  $(".collapsible2").css("color","black")
  $(".collapsible2").prop('disabled',false);
  $(".content-payment-option").css({ display: "block" });
  $(".content-delivery-option").css({ display: "none" });
}




toggle(item)
{
  var coll = document.getElementsByClassName(item);
  var i;
  
  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";

    }

   
    });
  }


}


toggleAddress(item)
{
  var coll = document.getElementsByClassName(item);
  var i;
  
  for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block" &&  this.addressOp=="Add Address") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
      $("#paycontent").css('display',"none")
      $("#delivercontent").css('display',"none")
    }
  
    



    });
  }

}



toggleWithDelivery()
{
  $("#addressContentId").css('display',"none")
  $("#paycontent").css('display',"none")
}

toggleWithPayment()
{
  $("#addressContentId").css('display',"none")
  $("#delivercontent").css('display',"none")
}



} 
