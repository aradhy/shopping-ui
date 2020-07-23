import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { BucketView } from './product/bucketview';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private selectionFormatState = new Subject<BucketView>();
  private rest = new Subject<boolean>();

  setSet(state: BucketView) {

     this.selectionFormatState.next(state);
   }
 
   getState(): Observable<BucketView> {

     return this.selectionFormatState.asObservable();
   }

   setResetAll(state: boolean) {
    //alert("bhai me rest state me hu")
       this.rest.next(state);
     }
   
     getResetAll(): Observable<boolean> {
  
       return this.rest.asObservable();
     }
  
}
