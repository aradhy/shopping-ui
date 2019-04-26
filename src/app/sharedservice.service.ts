import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private selectionFormatState = new Subject<any>();

  setSet(state: any) {
   
     this.selectionFormatState.next(state);
   }
 
   getState(): Observable<any> {
   
     return this.selectionFormatState.asObservable();
   }
}
