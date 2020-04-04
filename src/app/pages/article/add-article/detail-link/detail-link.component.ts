import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DetailsLink } from '../../../models/models.component';

@Component({
  selector: 'app-detail-link',
  templateUrl: './detail-link.component.html',
  styleUrls: ['./detail-link.component.css']
})
export class DetailLinkComponent implements OnInit {

  constructor() { }

  _ref: any;
  _id: number;

  @Output() passDeleteEntry: EventEmitter<any> = new EventEmitter();
  details: DetailsLink = new DetailsLink();

  ngOnInit() {
  }

  removeObject(){
    this._ref.destroy();
    this.passDeleteEntry.emit(this._id);
  }
}
