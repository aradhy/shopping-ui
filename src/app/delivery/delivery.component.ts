import { Component, OnInit, Renderer, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TokenResponse } from '../user/model/token-Response';
import * as $ from 'jquery';
import { Address } from './address';
import { Slot } from './slot';
import { DeliveryService } from './delivery.service';
import { Product } from '../product/product';
import { OrderResponse } from './order-response';

@Component({
  selector: 'app-deliver',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit,AfterContentInit,AfterViewInit {
  addressForm:FormGroup;
  addressOp='Change Address'
 
  slotList:Array<Slot>=new Array<Slot>()
 productList:Product[];
 orderSuccess:boolean=false ;
 orderResponse:OrderResponse;

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
  $("#addrCardId").show();
  document.getElementById("formId").style.display='none';
  $("#deliverid").show();

  }
  else{
   
    document.getElementById("addressContentId").style.display='block';
 //   document.getElementById("addressListId").style.display='none';
      $("#addrCardId").hide();
    document.getElementById("formId").style.display='block';
    //document.getElementById("adripd").style.display="none"
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
addressList:Array<Address>=[];
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
  
   // this.date1= new Date();
   
 /*    $(".DeliAdd").css({ display: "none" });
    $(".Payment-Options").css({ display: "none" });
    $(".Delivery-Options").css({ display: "none" });
    this.orderSuccess=true */
  //this.date1.setDate( this.date1.getDate() + 1 )


 
    /*let slot1=new Slot();
    slot1.time1 = new Date();
    slot1.time2 = new Date(slot1.time1..getDate() + 1);*/


   // this.slotList.push(slot1);
  // let dateFormat = require('dateformat');
   //let now = new Date();
//dateFormat(now, "dddd,mmmm dS,yyyy,h:MM:ss TT");
  // this.date=dateFormat(now, "dddd,mmmm dS,yyyy,h:MM:ss TT")
 // this.date=new Date();
  
    let address=new Address();
    address.id='1';
    address.name='Sangam Vihar'
    address.city='New Delhi'
    address.country='India'
    address.email='mishra.shiv68@gmail.com'
    address.landmark='Opposite Batra Hospital'
    address.state='Delhi'
    address.addressDetails='Near Radha krishna Mandir'
    this.addressList.push(address)

    let address1=new Address();
    address1.id='2'
    address1.name='Sarita Vihar'
    address1.city='New Delhi'
    address1.country='India'
    address1.email='mishra.shiv68@gmail.com'
    address1.landmark='Opposite Metro Hospital'
    address1.state='Delhi'
    address1.addressDetails='Near Radha krishna Mandir'
    this.addressList.push(address1)
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
    this.addressOp='Change Address'

  console.log(this.addressList)

  
    $("#delivercontent").show()
     this.httpClient.post<TokenResponse>("http://localhost:8080/addressDetails", {}).subscribe(
      tokenResponse  => {
     if(tokenResponse.code==201)
     {
     
        document.getElementById("formId").style.display='none';
        this.addressList.push(addressModel)
     }
     

   
      
 });  

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
 
  let id =address.id;
  let idCss='#'+id
  $(".addressCard").css("border-color", "grey");
  $(idCss).css("border-color", "#9ACD32");
  $(idCss).css('border-width','2px');
}





onSubmit()
{
 
  this.delService.fetchBucket().subscribe(response =>
    {
      
      this.productList = response;
     
   
    });
  

let order={

"orderDetails": "Combo Pack",
"amount":"400.00",
"paymentMode":"CC",
"orderItemList" :this.productList


}

  this.httpClient.post<OrderResponse>('http://localhost:8080/order',order).subscribe(orderResponse=>
  {
    this.orderResponse=orderResponse;
    $(".DeliAdd").css({ display: "none" });
    $(".Payment-Options").css({ display: "none" });
    $(".Delivery-Options").css({ display: "none" });
    this.orderSuccess=true
    $('form[name=payuform]').attr('action','https://sandboxsecure.payu.in/_payment');
    $('input[name="hash"]').val(this.orderResponse.hash)
    $('input[name="key"]').val(this.orderResponse.key)
    $('input[name="firstname"]').val(this.orderResponse.firstname)
    $('input[name="phone"]').val(this.orderResponse.phone)
    $('input[name="email"]').val(this.orderResponse.email)
    $('input[name="productinfo"]').val(this.orderResponse.productinfo)
    $('input[name="surl"]').val(this.orderResponse.sUrl)
    $('input[name="txnid"]').val(this.orderResponse.txnId)
    $('input[name="amount"]').val(this.orderResponse.amount)
    $('form[name=payuform]').submit();
    
     
    }
  

    
  )
 
return true;
}


} 
