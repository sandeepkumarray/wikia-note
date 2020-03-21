import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() public modalDetails;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    
  }

  passBack() {
    this.activeModal.close(true);
  }
}
