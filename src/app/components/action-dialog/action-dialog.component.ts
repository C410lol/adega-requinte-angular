import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [],
  templateUrl: './action-dialog.component.html',
  styleUrls: [
    './action-dialog.component.css',
    '../../styles/dialog-styles.css'
  ]
})
export class ActionDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<ActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }




  clickBtn(action: string): void {
    this.dialogRef.close(action);
  }

}
