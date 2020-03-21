import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { ArticleService,  } from '../../article.service';

import { SectionItem } from '../../../models/models.component';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.css']
})
export class AddSectionComponent implements OnInit {

  _ref:any;  
  @Output() passDeleteEntry: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  section: SectionItem = new SectionItem();

  removeObject(){
    this._ref.destroy();
    this.passDeleteEntry.emit(this.section.id);
  }
  
  descriptionNoteconfig: any = {
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      image: [
        ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
        ['float', ['floatLeft', 'floatRight', 'floatNone']],
        ['remove', ['removeMedia']]
      ],
      link: [
        ['link', ['linkDialogShow', 'unlink']]
      ],
      air: [
        [
          'font',
          [
            'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear'
          ]
        ],
      ]
    },
    height: '200px',
    uploadImagePath: '/api/upload',
    toolbar: [
      ['edit', ['codeview', 'fullscreen', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['fontname', ['fontname']],
      ['font', ['strikethrough', 'superscript', 'subscript']],
      ['fontsize', ['fontsize']],
      ['Insert', ['picture', 'link', 'video']],
      ['Table', ['table']],
      ['color', ['forecolor', 'backcolor']],
      ['para', ['style', 'ul', 'ol', 'paragraph']],
      ['height', ['height']]
    ],
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true
  };
}