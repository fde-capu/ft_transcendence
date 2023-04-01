import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() closed = true;

  @Output() closedChange = new EventEmitter<boolean>();

  @Input() title?: string;

  open() {
    this.closed = false;
    this.closedChange.emit(this.closed);
  }

  close() {
    this.closed = true;
    this.closedChange.emit(this.closed);
  }
}
