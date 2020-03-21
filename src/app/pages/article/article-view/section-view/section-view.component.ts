import { Component, OnInit, Input } from '@angular/core';

import { SectionItem } from '../../../models/models.component';

@Component({
  selector: 'app-section-view',
  templateUrl: './section-view.component.html',
  styleUrls: ['./section-view.component.css']
})
export class SectionViewComponent implements OnInit {

  @Input() section: SectionItem;
  constructor() { }

  ngOnInit() {
  }

}
