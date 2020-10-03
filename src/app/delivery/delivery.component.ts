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
import { PaymentType } from './payment-type';
import { AppService } from '../app-service';

@Component({
  selector: 'app-deliver',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  addressForm:FormGroup;
  addressOp='Change Address'
  selectedSlot:Slot;
  selectedPaymentType:PaymentType;
  slotList:Array<Slot>= [
    {"name": "Today 6pm to 10pm", "id": 1},
    {"name": "Tommorow 7 to 10pm", "id":2},
    {"name": "Tommorow 3pm to 6pm", "id":3},
    {"name": "Tommorow 2pm-5pm", "id":4},
    {"name": "Tommorow 11am-1pm", "id":5}
  ]

 paymentTypeList:Array<Slot>= [
    {"name": "COD(credit/debit/cash)", "id": 1},
    {"name": "Debit Card", "id":2},
    {"name": "Wallet", "id":3},
    {"name": "Net banking", "id":4},
    {"name": "Credit Card", "id":5}
  ]
 productList:Product[];
 orderSuccess:boolean=false ;
 orderResponse:OrderResponse;
 addressList:Address[]=[];
  addressId: string;
  selectedAddress:Address;
 

 
  ngOnInit() {
  
    this.delService.getAddress().subscribe(response=>{
      this.addressList=response.obj
    
     console.log(this.addressList)
      if(this.addressList.length>0)
      {
      this.addressList.forEach(addrss=>{
       if(addrss.primary)
       {
           this.selectedAddress=addrss
           console.log(this.selectedAddress)
       }

      });
     
    }
    else{
     
      this.addressOp="Add Address"
     
          // this.showForm();
    }

    this.setJs();  
    })

    this.selectedSlot=this.slotList[0];
    this.selectedPaymentType=this.paymentTypeList[0];
  
  }


  onChange(mrChange: MatRadioChange)
  {
   // alert(mrChange.value)
  }


  getTheSlot(slotChange: MatRadioChange)
  {
   // alert(slotChange.value)
   this.selectedSlot=slotChange.value
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
  $(".allCard").show();
  document.getElementById("formId").style.display='none';
  $("#deliverid").show();
  $(".addressSel").hide();
  $(".addressCard").hide();


  }
  else{
  
    //document.getElementById("addressContentId").style.display='none';
      $("#addrCardId").hide();
      $("#adripd").hide()
    document.getElementById("formId").style.display='block';
   // alert("add address")
    scrollTo(5, 1);
  }
 
}


cancel()
{
  document.getElementById("addrCardId").style.display='block';
  
 document.getElementById("adripd").style.display="block"
  document.getElementById("formId").style.display='none';
   this.  addressOp='Add Address'
   $("#deliverid").show();
   scrollTo(5, 1);
  
}

  constructor(formBuilder:FormBuilder,private httpClient: HttpClient,private renderer: Renderer, private elem: ElementRef,private delService:DeliveryService,private appService:AppService) {
    this.addressForm=formBuilder.group({
      firstName: new FormControl(),
      lastName: new FormControl(),
      address:new FormControl(),
       email: new FormControl(),
       city: new FormControl(),
       state: new FormControl(),
       landMark: new FormControl(),
       houseNo:new FormControl()
    });


   }

 

  showForm()
  {
    $("#addrFormId").show();
  }
  onSubmitAddress(addressForm:any)
  {    
    
    let addressDetails=new Address()
    addressDetails.firstName=addressForm.controls.firstName.value;
    addressDetails.lastName=addressForm.controls.lastName.value;
    addressDetails.email=addressForm.controls.email.value;
    addressDetails.addressDetails=addressForm.controls.address.value;
    addressDetails.city=addressForm.controls.city.value;
    addressDetails.state=addressForm.controls.state.value;
    addressDetails.houseNo=addressForm.controls.houseNo.value;
    addressDetails.landmark=addressForm.controls.landMark.value; 
    if(this.addressList.length==0)
    {
      addressDetails.primary=true;
    }
    
    this.addressForm.reset();
    this.addressOp='Change Address'

 

  
    $("#delivercontent").show()
     this.httpClient.post<TokenResponse>("http://localhost:8080/addressDetails", addressDetails).subscribe(
      tokenResponse  => {
       
     if(tokenResponse.code==201)
     {
     
        document.getElementById("formId").style.display='none';
        this.addressList.push(addressDetails)
        this.toggleAddress("collapsible");
        this.selectedAddress=addressDetails
        $(".content").css({ display: "none" }); 
       // $(".DeliAdd").css({ display: "block",height:"auto" });
        
        $(".defaultClass").css({ display: "block" });
      
        $(".addressCard").css({ display: "block" }); 
        $('.collapsible').css({display: "block" });
      
       
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
  $(".selectedSlot").css({ display: "block" });
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
  $(".selectedSlot").css({ display: "none" });
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
  this.selectedAddress=address
  $(".content").css({ display: "none" }); 
  // $(".DeliAdd").css({ display: "block",height:"auto" });
   
   $(".defaultClass").css({ display: "block" });
 
   $(".addressCard").css({ display: "block" }); 
   $('.collapsible').css({display: "block" });
   this.addressOp='Change Address'
   $("#delivercontent").css({ display: "block" });
  
}





onSubmit()
{
 
  let userStorage = localStorage.getItem("USER");
  if (this.appService.checkForNullONullString(userStorage))
  {
    let userInfo = JSON.parse(localStorage.getItem("USER"));    
    if (userInfo.userId != null)
    {
         this.delService.fetchBucket(this.selectedAddress.id,this.selectedPaymentType.name,userInfo.userId);
    }
  }

}


} 
