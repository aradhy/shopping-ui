import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { BucketView } from './product/bucketview';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private selectionFormatState = new Subject<BucketView>();

  setSet(state: BucketView) {
  
     this.selectionFormatState.next(state);
   }
 
   getState(): Observable<BucketView> {

     return this.selectionFormatState.asObservable();
   }
}
