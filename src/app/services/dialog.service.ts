import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';
import { DialogStatus } from '../constants/DialogStatusEnum';
import { Overlay } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { ActionDialogComponent } from '../components/action-dialog/action-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private matDialog: MatDialog,
    private overlay: Overlay
  ) { }




  getDialogOptions(
    type: string,
    data: {status?: DialogStatus, title?: string, message?: string}
  ): MatDialogConfig {
    const backdrop = type == 'status' ? 'dialog-status-backdrop' : 'dialog-action-backdrop';
    const scroll = type == 'status' ? this.overlay.scrollStrategies.noop() : undefined;

    return {
        maxWidth: '400px',
        minWidth: '300px',

        backdropClass: backdrop,
        panelClass: 'dialog',
        scrollStrategy: scroll,
    
        position: { left: '50%', bottom: '25px' },

        data: data
    }
  }




  openDialogSuccess(title?: string, message?: string): void {
    this.matDialog.open(DialogComponent, this.getDialogOptions(
      'status',
      {status: DialogStatus.SUCCESS, title: title, message: message}
    ));
  }

  openDialogWarning(title?: string, message?: string): void {
    this.matDialog.open(DialogComponent, this.getDialogOptions(
      'status',
      {status: DialogStatus.WARNING, title: title, message: message}
    ));
  }

  openDialogError(message?: string): void {
    this.matDialog.open(DialogComponent, this.getDialogOptions(
      'status',
      {status: DialogStatus.ERROR, message: message}
    ));
  }




  openActionDialog(title: string): Observable<any> {
    return this.matDialog.open(ActionDialogComponent, this.getDialogOptions(
      'action',
      { title: title }
    )).afterClosed();
  }

}
