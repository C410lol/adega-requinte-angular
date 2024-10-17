import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css'
})
export class CheckboxComponent {

  @Input() placeholder: string = '';
  @Input() value: any = '';
  @Input() checked: boolean = false;

  @Output() check = new EventEmitter<{checked: boolean, value: string}>();




  constructor() {}




  checkEmmit(): void {
    this.checked = !this.checked;
    this.check.emit({checked: this.checked, value: this.value});
  }

}
