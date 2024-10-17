import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';
import { DialogStatus } from '../constants/DialogStatusEnum';
import { Overlay } from '@angular/cdk/overlay';
import { Observable } from 'rxjs';
import { ActionDialogComponent } from '../components/action-dialog/action-dialog.component';
import { LoadDialogComponent } from '../components/load-dialog/load-dialog.component';

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
    data?: {status?: DialogStatus, title?: string, message?: string}
  ): MatDialogConfig {
    const minWidth = type == 'loading' ? undefined : '300px';
    const backdrop = type == 'status' ? 'dialog-status-backdrop' : 'dialog-action-backdrop';
    const panelClass = type == 'loading' ? 'loading-dialog' : 'dialog';
    const scroll = type == 'status' ? this.overlay.scrollStrategies.noop() : undefined;
    const position = type == 'loading' ? undefined : { left: '50%', bottom: '25px' };
    const diableClose = type == 'loading' ? true : false;

    return {
        maxWidth: '400px',
        minWidth: minWidth,

        backdropClass: backdrop,
        panelClass: panelClass,
        scrollStrategy: scroll,
    
        position: position,

        disableClose: diableClose,

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




  openLoadingDialog(): MatDialogRef<any> {
    return this.matDialog.open(LoadDialogComponent, this.getDialogOptions('loading'));
  }

}
