import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { BucketViewService } from '../bucket-view-service.service';
import { CookieBucket } from '../menus/bucketcookie';
import { Subscription } from 'rxjs';
import { SharedService } from '../sharedservice.service';
import { Router } from '@angular/router';
import { BucketView } from '../product/bucketview';
import * as $ from 'jquery';
@Component({
  selector: 'app-check-out-view',
  templateUrl: './check-out-view.component.html',
  styleUrls: ['./check-out-view.component.css']
})
export class CheckOutViewComponent implements OnInit {
  bucketView:BucketView;
  private subscription: Subscription;
  @Output() bucketViewEmitter: EventEmitter<BucketView> = new EventEmitter(); 

  COOKIE_BUCKET_ID: string = "DefaultBucket"
  constructor(private bucketViewService:BucketViewService,private sharedService:SharedService,private router:Router) { 

   this.subscription= this.sharedService.getState().subscribe(bucketView=>{
    this.bucketView=bucketView
   
  });

  }

  ngOnInit() {
    let userInfo = JSON.parse(localStorage.getItem("USER"));    
    if (userInfo.userId != null)
    {
      this.COOKIE_BUCKET_ID = userInfo.userId;
    }
    this.showCart(this.COOKIE_BUCKET_ID)
  } 

  openAddress()
  {
   this.router.navigateByUrl("/delivery")
   
  }


  removeFromBucket(x:string)
  {
    this.bucketViewService.removeFromBucket(x)
    this.bucketViewEmitter.emit(this.bucketView)
   
  }
   
  addQty(selectedProdAvail:any,selectedItemCount:number)
  {
   
    this.bucketViewService.addQty(selectedProdAvail,selectedItemCount)
   this.bucketViewEmitter.emit(this.bucketView)
    
  }
  
  subQty(selectedProdAvail:any,selectedItemCount:any)
  {
  
    this.bucketViewService.subQty(selectedProdAvail,selectedItemCount)
    this.bucketViewEmitter.emit(this.bucketView)
  }
  

  showCart(bucketId:string)
  {
   
  this.bucketView=  this.bucketViewService.showCart(bucketId)
    
  }
  
  updateItemCount(selectedProdAvail:string,selectedItemCount:any)
  {
    
    this.bucketViewService.updateItemCount(selectedProdAvail,selectedItemCount)
    this.bucketViewEmitter.emit(this.bucketView)
    
  }
  
  
  
  
  
 
  
  

}
