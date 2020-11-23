import { Component, OnInit } from '@angular/core';


export class ArticleItem {
  public procedureName?: string;
  public id?: string;
  public title?: string;
  public user?: string;
  public category?: any[];
  public description?: string;
  public summary?: string;
  public bannerimg?: string;
  public is_featured?: any;
  public is_active?: string;
  public isactive?: any;
  public created_at?: string;
  public link?: string;
  public isfeatured?: any;
  public userid?: any;
  public slug?: string;
  public categoryID?: any;
  public status?: any;
  public sections: SectionItem[];
}

export class DynamicArticleData {
  public procedureName?: string;
  public id?: string;
  public title?: string;
  public user?: string;
  public category?: string;
  public description?: string;
  public summary?: string;
  public bannerimg?: string;
  public is_featured?: string;
  public is_active?: string;
  public isactive?: any;
  public created_at?: string;
  public link?: string;
  public isfeatured?: any;
  public slug?: string;
  public userid?: any;
  public categoryID?: any;
  public status?: any;
  public sections: SectionItem[];
  public infocard: string;
  public type: string;
  
  public deletedSections?: any[];
}

export class SectionItem {
  public id: number;
  public title?: string = "";
  public description: string;
  public enc_description: string;
  public status: number;
  public sortorder: number;
}

export class CategoryItem {
  public procedureName?: string;
  public id: number;
  public category_name: string;
}

export class ResponseModel {
  public success = false;
  public data;
  public message = '';
}

export class ComponentItem {
  public component: any;
  public id: number;
}

export enum toastStatus {
  primary = 'primary',
  success = 'success',
  info = 'info',
  warning = 'warning',
  danger = 'danger',
}

export class ModalDetails {
  public title: string;
  public body: string;
  public confirmButtonText: string;
  public yesButtonText: string;
  public noButtonText: string;
  public confirmButtonVisisble: boolean;
  public yesButtonVisisble: boolean;
  public noButtonVisisble: boolean;
  public modalClass: string;
}

export class DetailsLink{
  public title: string;
  public link: string;
}

export class InfoDetailModal{
  public header: string;
  public datalist: DetailsLink[];
}

export class InfoGroupDetailModal{
  public header: string;
  public infoDetailList: InfoDetailModal[];
  
  constructor() { }
}

export class HtmlTableRowData{
  public TableData: string;
  public ListData: HtmlTableListData[];
  public RowHeader: string;
  public IsHeader: boolean;
  public IsList: boolean;

}

export class HtmlTableListData{
  public Data: string;
  public HasHyperLink: boolean;
  public HyperLink: string;
}

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.css']
})
export class ModelsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
