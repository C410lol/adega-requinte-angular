import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddressType } from '../../types/AddressType';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {

  @Input() selectedAddresId: string | null = null; 

  @Input() address = {} as AddressType;

  @Output() selectAddress: EventEmitter<void> = new EventEmitter<void>();




  constructor() { }




  selected(): void {
    this.selectAddress.emit();
  }

}
