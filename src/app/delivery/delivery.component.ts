import { Component, OnInit, Renderer, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../user/model/TokenResponse';
import * as $ from 'jquery';
import { Address } from './address';
import { Slot } from './slot';
import { DeliveryService } from './delivery.service';
import { Product } from '../product/Product';
import { OrderResponse } from './order-response';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-deliver',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  addressForm:FormGroup;
  addressOp='Change Address'
 
  slotList:Array<Slot>=new Array<Slot>()
 productList:Product[];
 orderSuccess:boolean=false ;
 orderResponse:OrderResponse;
 addressList:Address[]=[];
  addressId: string;
 
 


  ngInit(): void {
    
    
   
   
   
  }
  

  onChange(mrChange: MatRadioChange)
  {
    alert(mrChange.value)
  }


  getTheSlot(slotChange: MatRadioChange)
  {
    alert(slotChange.value)
  }
  ngAfterContentInit():void{
   
   

  }

  
 
addNewAddress()
{
  if(this.addressOp=='Change Address')
  { 
  this.addressOp="Add Address"
  document.getElementById("addressContentId").style.display='block';
  $("#addrCardId").show();
  document.getElementById("formId").style.display='none';
  $("#deliverid").show();

  }
  else{
   
    document.getElementById("addressContentId").style.display='block';
 
      $("#addrCardId").hide();
      $("#adripd").hide()
    document.getElementById("formId").style.display='block';
 
    scrollTo(5, 1);
  }
 
}


cancel()
{
  document.getElementById("addrCardId").style.display='block';
  
 document.getElementById("adripd").style.display="block"
  document.getElementById("formId").style.display='none';
   this.  addressOp='Change Address'
   $("#deliverid").show();
   scrollTo(5, 1);
  
}

  constructor(formBuilder:FormBuilder,private httpClient: HttpClient,private renderer: Renderer, private elem: ElementRef,private delService:DeliveryService) {
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
  
    
 
    this.delService.getAddress().subscribe(response=>{
      this.addressList=response.obj
    console.log(this.addressList)
      this.setJs(); 
    })
  }

  showForm()
  {
    $("#addrFormId").show();
  }
  onSubmitAddress(addressForm:any)
  {    
    let addressDetails=new Address()
    addressDetails.name=addressForm.controls.name.value;
    addressDetails.email=addressForm.controls.email.value;
    addressDetails.addressDetails=addressForm.controls.address.value;
    addressDetails.city=addressForm.controls.city.value;
    addressDetails.state=addressForm.controls.state.value;
    addressDetails.houseNo=addressForm.controls.houseNo.value;
    addressDetails.landmark=addressForm.controls.landMark.value; 
    this.addressForm.reset();
    this.addressOp='Change Address'

 

  
    $("#delivercontent").show()
     this.httpClient.post<TokenResponse>("http://localhost:8080/addressDetails", addressDetails).subscribe(
      tokenResponse  => {
        alert(tokenResponse.code)
     if(tokenResponse.code==201)
     {
     
        document.getElementById("formId").style.display='none';
        this.addressList.push(addressDetails)
     }
     

   
      
 });  

}
 

setJs()
{
 

  
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
  
  this.toggleAddress("collapsible");

 this.toggle("collapsible1");

  this.toggle("collapsible2");
    $(".collapsible2").prop('disabled',true);
    $(".collapsible2").css("color","#A9A9A9")
    $(".po").css("color","#A9A9A9")
    $(".content-delivery").css({ display: "block" }); 
}



}



proceedToPayment()
{
  $(".po").css("color","black")
  $(".do").css("color","black")
  $(".collapsible1").css("color","black")
  $(".collapsible2").css("color","black")
  $(".collapsible2").prop('disabled',false);
  $(".content-payment").css({ display: "block" });
  $(".content-delivery").css({ display: "none" });
  $("#deliverid").show();
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
  $("#deliverid").css('display',"none")
  this.addressOp='Change Address'
}

toggleWithPayment()
{
  $("#addressContentId").css('display',"none")
  $("#delivercontent").css('display',"none")
  this.addressOp='Change Address'
  
}



addressSelect(address)
{
 
  this.addressId =address.id;
  let idCss='#'+this.addressId;
  $(".addressCard").css("border-color", "grey");
  $(idCss).css("border-color", "#9ACD32");
  $(idCss).css('border-width','2px');
}





onSubmit()
{
 
 this.delService.fetchBucket(this.addressId);
  

}


} 
