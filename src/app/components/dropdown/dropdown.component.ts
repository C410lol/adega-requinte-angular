import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {

  @Output() clickItem: EventEmitter<{ name: string, value: string }> = new EventEmitter<{ name: string, value: string }>();

  @Input() items: { name: string, value: string }[] = [];

  @Input() isShown: boolean = false;




  constructor() {}




  onClickItem(item: { name: string, value: string }): void {
    this.clickItem.emit(item);
  }

}
