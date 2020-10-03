import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material';
import { UserComponent } from './user/user.component';








@Injectable({
  providedIn: 'root'
})
export class AppService {


  constructor(private dialog: MatDialog) {

  }

  openDialog(id): MatDialogRef<UserComponent> {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.height = "520px"
    dialogConfig.width = "320px"
    dialogConfig.data = id;

    let mref = this.dialog.open(UserComponent, dialogConfig);

    return mref;

  }


  checkForNullONullString(anyVal: string) {
    if (anyVal != null) {
      if (anyVal == 'null') {
        return false;
      }
      else{
        return true;
      }
    }
    return false;
  }


}
