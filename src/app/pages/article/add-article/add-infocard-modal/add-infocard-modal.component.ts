import { Component, OnInit, Output, EventEmitter, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { DetailsLink, InfoDetailModal, ComponentItem } from '../../../models/models.component';
import { DetailLinkComponent } from '../detail-link/detail-link.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-infocard-modal',
  templateUrl: './add-infocard-modal.component.html',
  styleUrls: ['./add-infocard-modal.component.css']
})
export class AddInfocardModalComponent implements OnInit {

  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  detailLinkComponentclass = DetailLinkComponent;

  infoDetails: InfoDetailModal = new InfoDetailModal();
  components: ComponentItem[] = [];
  accordIcon: string = "fa fa-chevron-up";
  collapseClass: string = "collapse show";
  _ref: any;
  _id: number;
  @Output() passDeleteEntry: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.accordionHideShow();
  }

  addComponent(componentClass: Type<DetailLinkComponent>) {
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

  passBack() {
    this.infoDetails.datalist = [];
    let res = [];
    let dup = [];
    let details: DetailsLink[] = [];
    this.components.map(function (item) {
      var existItem = res.find(x => x.component.instance.details.title == item.component.instance.details.title);
      if (existItem) {
        dup.push(existItem);
      }
      else
        res.push(item);
      details.push(item.component.instance.details);
    });

    this.infoDetails.datalist = details;

    //this.activeModal.close(this.infoDetails);
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


  addDetailLinkComponent(componentClass: Type<DetailLinkComponent>, detailsLink: DetailsLink) {
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
    component.instance.details = detailsLink;

    this.components.push(compItem);
  }

}
