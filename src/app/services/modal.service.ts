import { Injectable } from '@angular/core';

import { ModalComponent } from '../pages/theme/modal/modal.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { toastStatus, ModalDetails } from '../pages/models/models.component';


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalService: NgbModal) { }

  modalDetails: ModalDetails = new ModalDetails();
  
  openModal(modalClass: toastStatus, title: string, body: string) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });

    this.modalDetails.title = title;
    this.modalDetails.body = body;
    this.modalDetails.yesButtonText = "Ok";
    this.modalDetails.confirmButtonText = "Confirm";
    this.modalDetails.yesButtonVisisble = true;
    this.modalDetails.modalClass = "bg-" + modalClass;

    modalRef.componentInstance.modalDetails = this.modalDetails;

    return "Ok";
  }
  
  openConfirmModal(modalClass: toastStatus, title: string, body: string) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });

    this.modalDetails.title = title;
    this.modalDetails.body = body;
    this.modalDetails.noButtonText = "Cancel";
    this.modalDetails.confirmButtonText = "Confirm";
    this.modalDetails.confirmButtonVisisble = true;
    this.modalDetails.noButtonVisisble = true;
    this.modalDetails.modalClass = "bg-" + modalClass;

    modalRef.componentInstance.modalDetails = this.modalDetails;

    modalRef.result.then((result) => {
      if (result) {
        console.log("confirm : " + result);
        return result;
      }
    });
  }
  
  openYesNoModal(modalClass: toastStatus, title: string, body: string) {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });

    this.modalDetails.title = title;
    this.modalDetails.body = body;
    this.modalDetails.yesButtonText = "Yes";
    this.modalDetails.noButtonText = "No";
    this.modalDetails.yesButtonVisisble = true;
    this.modalDetails.noButtonVisisble = true;
    this.modalDetails.modalClass = "bg-" + modalClass;

    modalRef.componentInstance.modalDetails = this.modalDetails;
    
    modalRef.result.then((result) => {      
      if (result) {
        console.log("confirm : " + result);
        return result;
      }
    });
  }
}
