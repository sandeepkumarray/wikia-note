import { Component, OnInit, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { ArticleService } from '../article.service';

import { ActivatedRoute } from '@angular/router';
import { AddSectionComponent } from '../add-article/add-section/add-section.component';

import { Router } from '@angular/router';

import { ToastService } from '../../../services/toast.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalService } from '../../../services/modal.service';

import { CategoryItem, ArticleItem, ResponseModel, DynamicArticleData, SectionItem, ComponentItem, toastStatus, ModalDetails } from '../../models/models.component';
import { ignoreElements } from 'rxjs/operators';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {

  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;


  isOpenForEdt: boolean;
  IdealIMGWidth = 564;
  IdealIMGHeight = 700;
  slug: any;
  components: ComponentItem[] = [];

  addSectionComponentClass = AddSectionComponent;

  addArticleComponent = AddArticleComponent;

  constructor(private activatedRoute: ActivatedRoute, private articleService: ArticleService, public toastService: ToastService, private modalService: ModalService,
    private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {
    this.slug = this.activatedRoute.snapshot.paramMap.get('slug');
    console.log("slug : " + this.slug);

    if (this.slug != null) {
      this.getArticleBySlug(this.slug);
      this.getArticleSectionsBySlug(this.slug);
      this.isOpenForEdt = true;
    }
  }

  bannerImage: any;
  blankImage: string = "assets\img\blank.png";
  descriptionTmpl: string;
  article: ArticleItem = new ArticleItem();
  dynamicArticle: DynamicArticleData = new DynamicArticleData();
  submitted = false;
  categories: CategoryItem[];
  modalDetails: ModalDetails = new ModalDetails();
  editorDisabled = false;
  allSections: SectionItem[] = [];
  deletedSections: any[] = [];

  ngOnInit() {
    this.articleService.getAllCategory().subscribe(result => {
      this.categories = [];
      this.categories = this.categories.concat(result);
    });
  }

  onImageChange(event) {
    let image: any = event.target.files[0];
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.bannerImage = myReader.result;
    }
    myReader.readAsDataURL(image);
  }

  saveArticle(form) {
    //save article to db
    this.article.categoryID = this.article.category;
    this.article.isactive = 1;
    this.article.isfeatured = this.article.is_featured ? 1 : 0;
    this.article.userid = 1;

    this.article.bannerimg = this.bannerImage;
    this.article.description = "";
    console.log(this.article);
    var response = new ResponseModel();
    this.articleService.saveArticle(this.article).subscribe(res => {
      response = res;
      console.log(response);

      if (response != null) {
        this.submitted = true;
        if (response.success) {
          this.modalService.openModal(toastStatus.success, "Post Article", response.message);
          this.router.navigate(['/pages/article/article-view/', response.data]);
        }
        else {
          this.modalService.openModal(toastStatus.danger, "Post Article", response.message);
        }
      }
      else {
        this.modalService.openModal(toastStatus.danger, "Post Article", "Error while posting article.");
      }
    });

  }

  onImageLoad(event) {
    var imgHeight = event.path[0].naturalHeight;
    var imgWidth = event.path[0].naturalWidth;

    if (imgHeight > this.IdealIMGHeight || imgWidth > this.IdealIMGWidth) {
      alert("Image size exceeds 564 X 700");
      this.bannerImage = "";
    }
  }

  SummaryInit(event) {
    console.log('SummaryInit');
    console.log(event)
  }

  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }

  onDelete(event) {
    console.log('onDelete');
    console.log(event)
  }

  addComponent(componentClass: Type<AddSectionComponent>) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.container.createComponent(componentFactory);

    // Push the component so that we can keep track of which components are created
    var compItem = new ComponentItem();
    compItem.component = component;
    compItem.id = this.components.length + 1;
    component.instance._ref = component;
    this.components.push(compItem);
  }

  saveAsDraft() {

    let res = [];
    let dup = [];
    let sections: SectionItem[] = [];

    this.components.map(function (item) {
      var existItem = res.find(x => x.component.instance.section.title == item.component.instance.section.title);
      if (existItem) {
        dup.push(existItem);
      }
      else
        res.push(item);
      sections.push(item.component.instance.section);
    });

    if (dup != undefined && dup.length > 0) {
      this.modalService.openModal(toastStatus.danger, "Save Article As Draft", "Duplicate section title found.");
    }
    else {
      this.dynamicArticle.title = this.article.title;
      this.dynamicArticle.summary = this.article.summary;
      this.dynamicArticle.description = this.article.description;
      this.dynamicArticle.bannerimg = this.bannerImage;
      this.dynamicArticle.categoryID = this.article.category;
      this.dynamicArticle.isactive = 1;
      this.dynamicArticle.isfeatured = this.article.is_featured ? 1 : 0;
      this.dynamicArticle.userid = 1;
      this.dynamicArticle.sections = sections;      
      this.dynamicArticle.slug =this.dynamicArticle.title.split(" ").join("_");

      var response = new ResponseModel();

      if (!this.isOpenForEdt) {
        this.articleService.saveArticleAsDraft(this.dynamicArticle).subscribe(res => {
          response = res;
          console.log(response);

          if (response != null) {
            this.submitted = true;
            if (response.success) {
              this.modalService.openModal(toastStatus.success, "Save Article As Draft", response.message);
              this.router.navigate(['/article/article-view/', this.dynamicArticle.slug]);
            }
            else {
              this.modalService.openModal(toastStatus.danger, "Save Article As Draft", response.message);
            }
          }
          else {
            this.modalService.openModal(toastStatus.danger, "Save Article As Draft", "Error while saving article.");
          }
        });
      }
      else {
        console.log(this.deletedSections);
        
        this.dynamicArticle.id = this.article.id;
        this.dynamicArticle.status = 1;
        this.dynamicArticle.deletedSections = this.deletedSections;
        
        this.articleService.updateArticle(this.dynamicArticle).subscribe(res => {
          response = res;
          console.log(response);

          if (response != null) {
            this.submitted = true;
            if (response.success) {
              this.modalService.openModal(toastStatus.success, "Update Article", response.message);
              this.router.navigate(['/article/article-view/', this.dynamicArticle.slug]);
            }
            else {
              this.modalService.openModal(toastStatus.danger, "Update Article", response.message);
            }
          }
          else {
            this.modalService.openModal(toastStatus.danger, "Update Article", "Error while saving article.");
          }
        });
      }
    }
  }

  addCategory() {
    const modalRef = this.modalService.openModal(toastStatus.success, "Save Article As Draft", "Error while saving article.");
  }

  showToast(type: toastStatus, title: string, body: string) {
    this.toastService.show(body, {
      classname: "bg-" + type + " text-light",
      delay: 2000,
      autohide: true,
      headertext: title
    });
  }

  showCustomToast(customTpl) {
    this.toastService.show(customTpl, {
      classname: 'bg-danger text-light',
      delay: 3000,
      autohide: true
    });
  }

  postArticle() {
    this.saveAsDraft();
    this.dynamicArticle.status = 2;

    var response = new ResponseModel();
    this.articleService.updateArticleStatus(this.dynamicArticle).subscribe(res => {
      response = res;
      console.log(response);

      if (response != null) {
        this.submitted = true;
        if (response.success) {
          this.modalService.openModal(toastStatus.success, "Post Article", "Article is published.");
          this.router.navigate(['/article/article-view/', this.dynamicArticle.slug]);
        }
        else {
          this.modalService.openModal(toastStatus.danger, "Update Article", response.message);
        }
      }
      else {
        this.modalService.openModal(toastStatus.danger, "Update Article", "Error while saving article.");
      }
    });
  }

  getArticleBySlug(slug: string) {
    this.articleService.getArticleBySlug(slug)
      .subscribe((data: any) => {
        this.article.id = data.id;
        this.article.title = data.title;
        this.article.user = data.user;
        this.article.category = data.category;
        this.article.summary = data.summary;
        this.article.bannerimg = data.banner;
        this.bannerImage = data.banner;
        this.article.is_featured = data.is_featured == 1 ? "true" : "false";
        this.article.is_active = data.is_active;
        this.article.created_at = data.created_at;
        this.article.slug = data.slug;

        this.article.description = atob(data.description);

      });
  }

  getArticleSectionsBySlug(slug: string) {
    this.articleService.getArticleSectionsBySlug(slug)
      .subscribe((data: SectionItem[]) => {
        data.map(sec => {
          let section: SectionItem = new SectionItem();
          section.id = sec.id;
          section.title = sec.title;
          section.status = sec.status;
          section.description = atob(sec.description);
          this.addSectionComponent(this.addSectionComponentClass, section);
        });
      });


    // => {
    //   let section :SectionItem = new SectionItem();
    //   console.log(data);

    //   section.id = data.id;
    //   section.title = data.title;
    //   section.status = data.status;
    //   section.description = atob(data.description);

    //   this.addSectionComponent(this.addSectionComponentClass, section);
    // });
  }

  addSectionComponent(componentClass: Type<AddSectionComponent>, section: SectionItem) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.container.createComponent(componentFactory);

    // Push the component so that we can keep track of which components are created
    var compItem = new ComponentItem();
    compItem.component = component;
    compItem.id = this.components.length + 1;
    component.instance._ref = component;
    component.instance.section = section;
    component.instance.passDeleteEntry.subscribe((idEntry) => {
      console.log(idEntry);
      this.deletedSections.push(idEntry);
    })
    this.components.push(compItem);
  }
}