import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { ArticleService, } from '../../article.service';

import { SectionItem } from '../../../models/models.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var $;

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.css']
})
export class AddSectionComponent implements OnInit {

  _ref: any;
  @Output() passDeleteEntry: EventEmitter<any> = new EventEmitter();

  public ddtemplate: (context) => void;
  section: SectionItem = new SectionItem();

  constructor(private articleService: ArticleService) {
    this.ddtemplate = this.dropdownTemplate;
    console.log( this.ddtemplate );
  }

  accordIcon: string = "fa fa-chevron-up";
  collapseClass: string = "collapse show";

  ngOnInit() {
    this.accordionHideShow();
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

  removeObject() {
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
      ['custom', ['templates']],
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
    templates: {
      templates: 'assets/page-templates/', // The folder where the templates are stored.
      insertDetails: false, // true|false This toggles whether the below options are automatically filled when inserting the chosen page template.
      dateFormat: 'longDate',
      yourName: 'Your Name',
      yourTitle: 'Your Title',
      yourCompany: 'Your Comapny',
      yourPhone: 'Your Phone',
      yourAddress: 'Your Address',
      yourCity: 'Your City',
      yourState: 'Your State',
      yourCountry: 'Your Country',
      yourPostcode: 'Your Postcode',
      yourEmail: 'your@email.com'
    },
    // buttons: {
    //   'templates': this.ddtemplate
    // },
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true
  };

  customButton(context) {
    const ui = $.summernote.ui;
    const button = ui.button({
      contents: '<i class="note-icon-magic"></i> Hello',
      tooltip: 'Custom button',
      container: '.note-editor',
      className: 'note-btn',
      click: function () {
        context.invoke('editor.insertText', 'Hello from test btn!!!');
      }
    });
    return button.render();
  }

  dropdownTemplate(context: any) {
    console.log(context);

    const ui = $.summernote.ui;
    var pdfButton = ui.buttonGroup([
      ui.button({
        className: "dropdown-toggle",
        contents:
          '<span class="fa fa-file-pdf"></span> <span class="caret"></span>',
        tooltip: "Your tooltip",
        data: {
          toggle: "dropdown",
        },
      }),
      ui.dropdown({
        className: "drop-default summernote-list",
        contents:
          '' +
          '<a id="div-template-right-image" class="note-dropdown-item" data-value="div-template-right-image" role="listitem" aria-label="p"><p>Normal</p></a>' +
          '<a id=""div-template-left-image"" class="note-dropdown-item" data-value="div-template-left-image" role="listitem" aria-label="p"><p>Normal</p></a>' +
          '',
        callback: function ($dropdown) {
          $dropdown.find(".note-dropdown-item").click(function (event) {
            let res = this.articleService.getSectionTemplateFromSlug('Angel');

            console.log(event.currentTarget.attributes['data-value']['value']);

            let template_Name = event.currentTarget.attributes['data-value']['value'];
            context.invoke("editor.insertText", template_Name);
          });
        },
      }),
    ]);

    return pdfButton.render();
  }
}