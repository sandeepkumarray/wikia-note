import { Component, OnInit, Input, ViewChild, ElementRef, } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, isEmpty } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import {
  ArticleItem, ResponseModel, DynamicArticleData, SectionItem, InfoGroupDetailModal, toastStatus,
  HtmlTableRowData, HtmlTableListData
} from '../../models/models.component';
import { ArticleService } from '../article.service';
import { isUndefined } from 'util';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.css']
})

export class ArticleViewComponent implements OnInit {

  edit_Menu_Visible: boolean;
  @Input() article: ArticleItem;
  slug: any;

  @ViewChild('pdfsection', { static: true, read: ElementRef }) pdfsection: ElementRef;

  infocardTable: HtmlTableRowData[] = [];

  constructor(private articleService: ArticleService, private activatedRoute: ActivatedRoute,
    private http: HttpClient, private router: Router, private modalService: ModalService, private titleService: Title) {
    this.article = new ArticleItem();
    this.slug = this.activatedRoute.snapshot.paramMap.get('slug');
    let pageTitle = this.slug;
    do {
      pageTitle = pageTitle.replace("_", ' ');
    } while (pageTitle.includes("_"))

    this.titleService.setTitle(pageTitle + " - Wikia Note");

    this.edit_Menu_Visible = true;
  }

  ngOnInit() {
    this.getArticleDetails(this.slug);
  }

  getArticleDetails(slug: string) {
    this.article.sections = [];

    this.articleService.getArticleBySlug(slug).subscribe((data: any) => {
      if (data != null) {
        this.article.id = data.id;
        this.article.title = data.title;
        this.article.user = data.user;
        this.article.category = data.category;
        this.article.summary = data.summary;
        this.article.bannerimg = data.banner;
        this.article.is_featured = data.is_featured;
        this.article.is_active = data.is_active;
        this.article.created_at = data.created_at;
        this.article.slug = data.slug;
        this.article.description = atob(data.description);
        this.articleService.getArticleSectionsBySlug(slug)
          .subscribe((data: SectionItem[]) => {
            if (data != null) {
              data.map(sec => {
                let section: SectionItem = new SectionItem();
                section.id = sec.id;
                section.title = sec.title;
                section.status = sec.status;
                section.description = decodeURIComponent(sec.description);
                
                do {
                  section.description = section.description.replace("[QUOTE]", '"');
                } while (section.description.includes("[QUOTE]"))

                this.article.sections.push(section);
              });
            }
          });

        this.articleService.getArticleInfoCardBySlug(slug)
          .subscribe((data: any) => {

            let infocard = data.infocard.replace("[QUOTE]", "'");
            let infoGroupDetailList: InfoGroupDetailModal[] = JSON.parse(infocard);

            if (infoGroupDetailList != null) {

              infoGroupDetailList.map(sec => {

                let htmlRowData: HtmlTableRowData = new HtmlTableRowData();
                htmlRowData.TableData = sec.header;
                htmlRowData.IsHeader = true;
                this.infocardTable.push(htmlRowData);

                sec.infoDetailList.map(gdata => {

                  htmlRowData = new HtmlTableRowData();
                  htmlRowData.RowHeader = gdata.header;
                  htmlRowData.ListData = [];
                  htmlRowData.IsList = false;

                  if (gdata.datalist != null) {
                    gdata.datalist.map(ldata => {
                      let htmlTableListData: HtmlTableListData = new HtmlTableListData();
                      htmlTableListData.Data = ldata.title;
                      if (isUndefined(ldata.link)) {
                        htmlTableListData.HasHyperLink = false;
                        htmlTableListData.HyperLink = null;
                      }
                      else {
                        htmlTableListData.HasHyperLink = true;
                        htmlTableListData.HyperLink = ldata.link;
                      }
                      htmlRowData.IsList = true;
                      htmlRowData.ListData.push(htmlTableListData);
                    });
                  }
                  this.infocardTable.push(htmlRowData);

                });


              });
            }
          });
      }
      else {
        this.edit_Menu_Visible = false;
        this.articleService.getArticleBySlug("Not_Found").subscribe((data: any) => {
          this.article.id = "0";
          this.article.title = slug;
          this.article.user = null;

          this.articleService.getArticleSectionsBySlug("Not_Found")
            .subscribe((data: SectionItem[]) => {
              data.map(sec => {
                let section: SectionItem = new SectionItem();
                section.id = sec.id;
                section.title = slug;
                section.status = sec.status;
                section.description = decodeURIComponent(sec.description);
                section.description = section.description.split("[TITLE]").join(slug);
                this.article.sections.push(section)
              });
            });
        });
      }
    });

    // this.http.get(apiURL).pipe(
    //   map((res: any) => {return res }))
    //   .subscribe((data: any) => 
    //   { 
    //     this.article.id	=	data.id;
    //     this.article.title	=	data.title;
    //     this.article.user	=	data.user;
    //     this.article.category	=	data.category;
    //     this.article.summary	=	data.summary;
    //     this.article.bannerimg	=	data.banner;
    //     this.article.is_featured	=	data.is_featured;
    //     this.article.is_active	=	data.is_active;
    //     this.article.created_at	=	data.created_at;
    //     this.article.slug	=	data.slug;        
    //     this.article.description	=	atob(data.description);

    //   });
  }

  editArticle(slug: string) {
    this.router.navigate(['/article/edit-article/', slug]);
  }

  approveArticle(article: ArticleItem) {
    let dynamicArticle = new DynamicArticleData();
    dynamicArticle.slug = article.slug;
    dynamicArticle.id = article.id;

    dynamicArticle.status = 2;

    var response = new ResponseModel();
    this.articleService.updateArticleStatus(dynamicArticle).subscribe(res => {
      response = res;
      if (response != null) {
        if (response.success) {
          this.modalService.openModal(toastStatus.success, "Post Article", "Article is published.");
          this.router.navigate(['/articles/', dynamicArticle.slug]);
        }
        else {
          this.modalService.openModal(toastStatus.danger, "Post Article", response.message);
        }
      }
      else {
        this.modalService.openModal(toastStatus.danger, "Post Article", "Error while publishing article.");
      }
    });
  }

  rejectArticle(article: ArticleItem) {
    let dynamicArticle = new DynamicArticleData();
    dynamicArticle.slug = article.slug;
    dynamicArticle.id = article.id;

    dynamicArticle.status = 5;

    var response = new ResponseModel();
    this.articleService.updateArticleStatus(dynamicArticle).subscribe(res => {
      response = res;
      if (response != null) {
        if (response.success) {
          this.modalService.openModal(toastStatus.success, "Reject Article", "Article is Rejected.");
          this.router.navigate(['/articles/', dynamicArticle.slug]);
        }
        else {
          this.modalService.openModal(toastStatus.danger, "Reject Article", response.message);
        }
      }
      else {
        this.modalService.openModal(toastStatus.danger, "Reject Article", "Error while rejecting article.");
      }
    });
  }

  deleteArticle(slug: string) {
    let dynamicArticle = new DynamicArticleData();
    dynamicArticle.slug = slug;

    var response = new ResponseModel();
    this.articleService.deleteArticle(dynamicArticle).subscribe(res => {
      response = res;
      if (response != null) {
        if (response.success) {
          this.modalService.openModal(toastStatus.success, "Articles", response.message);
          this.router.navigate(['/article/articles/']);
        }
        else {
          this.modalService.openModal(toastStatus.danger, "Articles", response.message);
        }
      }
      else {
        this.modalService.openModal(toastStatus.danger, "Articles", "Error while deleting article.");
      }
    });
  }

}
