import { Component, OnInit, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef, EventEmitter, Output } from '@angular/core';
import { AddInfocardModalComponent } from '../add-infocard-modal/add-infocard-modal.component';

import { DetailsLink, InfoDetailModal, InfoGroupDetailModal, ComponentItem } from '../../../models/models.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-add-infocard-group',
  templateUrl: './add-infocard-group.component.html',
  styleUrls: ['./add-infocard-group.component.css'],
})
export class AddInfocardGroupComponent implements OnInit {

  infoGroupDetailModal: InfoGroupDetailModal = new InfoGroupDetailModal();
  addInfocardModalComponent = AddInfocardModalComponent;

  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;

  @Output() passDeleteEntry: EventEmitter<any> = new EventEmitter();

  components: ComponentItem[] = [];
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }
  accordIcon: string = "fa fa-chevron-up";
  collapseClass: string = "collapse show";
  _ref: any;
  _id: number;

  ngOnInit() {
  }

  addComponent(componentClass: Type<AddInfocardModalComponent>) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.container.createComponent(componentFactory);

    // Push the component so that we can keep track of which components are created
    var compItem = new ComponentItem();
    compItem.component = component;
    compItem.id = this.components.length == 0 ? 1 : Math.max.apply(Math, this.components.map(function (o) { return o.id; })) + 1;
    component.instance._ref = component;
    component.instance._id = compItem.id;

    component.instance.passDeleteEntry.subscribe((idEntry) => {
      const index: number = this.components.findIndex(item => item.id == idEntry);
      if (index !== -1) {
        this.components.splice(index, 1);
      }
    })
    this.components.push(compItem);
  }

  removeObject() {
    this._ref.destroy();
    this.passDeleteEntry.emit(this._id);
  }

  accordionHideShow() {
    if (this.accordIcon == "fa fa-chevron-down") {
      this.accordIcon = "fa fa-chevron-up";
      this.collapseClass = "collapse show";
    }
    else {
      this.accordIcon = "fa fa-chevron-down";
      this.collapseClass = "collapse";
    }

  }

  addInfocardComponent(componentClass: Type<AddInfocardModalComponent>, infoDetailModal: InfoDetailModal) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.container.createComponent(componentFactory);

    // Push the component so that we can keep track of which components are created
    var compItem = new ComponentItem();
    compItem.component = component;
    compItem.id = this.components.length == 0 ? 1 : Math.max.apply(Math, this.components.map(function (o) { return o.id; })) + 1;
    component.instance._ref = component;
    component.instance._id = compItem.id;

    component.instance.infoDetails = infoDetailModal;

    infoDetailModal.datalist.forEach(detailsLink => {
      component.instance.addDetailLinkComponent(component.instance.detailLinkComponentclass, detailsLink);
    });

    component.instance.passDeleteEntry.subscribe((idEntry) => {
      const index: number = this.components.findIndex(item => item.id == idEntry);
      if (index !== -1) {
        this.components.splice(index, 1);
      }
    })
    this.components.push(compItem);
  }

}
