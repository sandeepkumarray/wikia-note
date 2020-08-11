import { Component, OnInit, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ArticleService } from '../article.service';
import { ActivatedRoute } from '@angular/router';
import { AddSectionComponent } from './add-section/add-section.component';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { ModalService } from '../../../services/modal.service';
import {
  CategoryItem, ArticleItem, ResponseModel, DynamicArticleData, SectionItem, ComponentItem, toastStatus,
  ModalDetails, DetailsLink, InfoDetailModal, InfoGroupDetailModal
} from '../../models/models.component';
import { AddInfocardGroupComponent } from './add-infocard-group/add-infocard-group.component';
import { Subscription } from 'rxjs';
import { isUndefined } from 'util';


@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css'],

  encapsulation: ViewEncapsulation.None
})
export class AddArticleComponent implements OnInit {

  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('infocontainer', { static: true, read: ViewContainerRef }) infocontainer: ViewContainerRef;

  header: any = "Add Article";
  isTemplate: boolean = false;
  type: any = "2";
  isOpenForEdt: boolean = false;
  IdealIMGWidth = 564;
  IdealIMGHeight = 700;
  slug: any;
  new_slug: any;
  components: ComponentItem[] = [];
  info_components: ComponentItem[] = [];

  addSectionComponentClass = AddSectionComponent;
  addInfocardGroupComponent = AddInfocardGroupComponent;

  public addTagNowRef: (name) => void;

  constructor(private activatedRoute: ActivatedRoute, private articleService: ArticleService,
    public toastService: ToastService, private modalService: ModalService,
    private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {
    this.slug = this.activatedRoute.snapshot.paramMap.get('slug');
    this.new_slug = this.activatedRoute.snapshot.paramMap.get('new_slug');

    if (this.slug != null) {
      this.isOpenForEdt = true;
      this.header = "Edit Article";
      this.loadArticleDetails(this.slug);
    }
    else if (this.new_slug != null) {
      this.article = new ArticleItem();
      this.article.title = this.new_slug;

      do {
        this.article.title = this.article.title.replace("_", ' ');
    } while ( this.article.title.includes("_") )
    }

    if (this.router.url.includes('/article/add-template')) {
      this.header = "Add Template";
      this.isTemplate = true;
      this.type = "1";
    }

    if (this.router.url.includes('/article/add-section-template')) {
      this.header = "Add Section Template";
      this.isTemplate = true;
      this.type = "3";
    }

    this.addTagNowRef = (name) => this.addNewCategory(name);
  }

  // addTagPromise : new Promise<any>(){

  // };

  loading = false;
  enableAddCategory = false;

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
  infoGroupDetailModalList: InfoGroupDetailModal[] = [];

  templateList: ArticleItem[];
  sectionTemplateList: ArticleItem[];

  selectedTemplate: any;

  ngOnInit() {
    this.articleService.getAllCategory().subscribe(result => {
      this.categories = [];
      this.categories = this.categories.concat(result);
    });

    this.getArticleTemplatesList();
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
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
    var response = new ResponseModel();
    this.articleService.saveArticle(this.article).subscribe(res => {
      response = res;
      if (response != null) {
        this.submitted = true;
        if (response.success) {
          this.modalService.openModal(toastStatus.success, "Post Article", response.message);
          this.router.navigate(['/pages/articles/', response.data]);
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
  }

  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }

  onDelete(event) {
  }

  addSecComponent(componentClass: Type<AddSectionComponent>) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.container.createComponent(componentFactory);

    // Push the component so that we can keep track of which components are created
    var compItem = new ComponentItem();
    compItem.component = component;
    compItem.id = this.components.length == 0 ? 1 : Math.max.apply(Math, this.components.map(function (o) { return o.id; })) + 1;

    component.instance._ref = component;
    let section: SectionItem = new SectionItem();
    section.title = "New Section";
    section.id = compItem.id;

    component.instance.section = section;
    this.allSections.push(component.instance.section);
    this.components.push(compItem);
  }

  addSectionTab() {
    let section: SectionItem = new SectionItem();
    section.title = "New Section";
    section.id = this.allSections.length == 0 ? 1 : Math.max.apply(Math, this.allSections.map(function (o) { return o.id; })) + 1;
    section.status = 1;
    this.allSections.push(section);
    console.log(this.allSections);
  }

  saveAsDraft() {
    this.saveAsDraftMethod();
    var response = new ResponseModel();

    console.log(this.dynamicArticle);


    if (!this.isOpenForEdt) {
      this.articleService.saveArticleAsDraft(this.dynamicArticle).subscribe(res => {
        response = res;
        if (response != null) {
          if (response.success) {
            this.submitted = true;
            this.modalService.openModal(toastStatus.success, "Save Article As Draft", response.message);
            this.router.navigate(['/articles/', this.dynamicArticle.slug]);
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
      this.articleService.updateArticle(this.dynamicArticle).subscribe(res => {
        response = res;
        if (response != null) {
          if (response.success) {
            this.submitted = true;
            this.modalService.openModal(toastStatus.success, "Update Article", response.message);
            this.router.navigate(['/articles/', this.dynamicArticle.slug]);
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

  saveAsDraftMethod() {

    let res = [];
    let dup = [];
    let sections: SectionItem[] = [];

    this.reorderSections();

    this.allSections.map(function (item) {
      var existItem = res.find(x => x.title == item.title);
      if (existItem) {
        dup.push(existItem);
      }
      else
        res.push(item);
      sections.push(item);
    });

    sections.forEach(sec => {
      if (!isUndefined(sec.description)) {
        sec.description = sec.description.replace('"', "[QUOTE]");
        sec.description = encodeURIComponent(sec.description);
      }
      else {
        sec.description = "";
      }
    });
    console.log(sections);

    let infores = [];
    let infodup = [];
    this.infoGroupDetailModalList = [];

    this.info_components.forEach(comp => {
      let infoGroupDetailModal: InfoGroupDetailModal = new InfoGroupDetailModal();
      infoGroupDetailModal.infoDetailList = [];
      infoGroupDetailModal.header = comp.component.instance.infoGroupDetailModal.header;
      comp.component.instance.components.forEach(subComp => {
        let infoDetailModal: InfoDetailModal = new InfoDetailModal();
        infoDetailModal.datalist = [];
        infoDetailModal.header = subComp.component.instance.infoDetails.header;
        subComp.component.instance.components.map(function (item) {
          var existItem = infores.find(x => x.component.instance.details.title == item.component.instance.details.title);
          if (existItem) {
            infodup.push(existItem);
          }
          else
            infores.push(item);
          infoDetailModal.datalist.push(item.component.instance.details);
        });
        infoGroupDetailModal.infoDetailList.push(infoDetailModal);
      });
      this.infoGroupDetailModalList.push(infoGroupDetailModal);
    });

    let infoCardString = JSON.stringify(this.infoGroupDetailModalList);
    console.log(infoCardString);

    if (dup != undefined && dup.length > 0) {
      this.modalService.openModal(toastStatus.danger, "Save Article As Draft", "Duplicate section title found.");
    }
    else {
      this.dynamicArticle.title = this.article.title;
      this.dynamicArticle.summary = this.article.summary;
      this.dynamicArticle.description = this.article.description;
      this.dynamicArticle.bannerimg = this.bannerImage;
      this.dynamicArticle.categoryID = this.article.category.map(x => x).join(",");
      this.dynamicArticle.isactive = 1;
      this.dynamicArticle.isfeatured = this.article.is_featured ? 1 : 0;
      this.dynamicArticle.userid = 1;
      this.dynamicArticle.sections = sections;

      this.dynamicArticle.infocard = (infoCardString);
      this.dynamicArticle.infocard = this.dynamicArticle.infocard.replace("'", "[QUOTE]");

      this.dynamicArticle.slug = this.dynamicArticle.title.split(" ").join("_");

      this.dynamicArticle.type = this.type;
      console.log("this.dynamicArticle.infocard=" + this.dynamicArticle.infocard);


      var response = new ResponseModel();

      if (this.isOpenForEdt) {
        this.dynamicArticle.id = this.article.id;
        this.dynamicArticle.status = 1;
        this.dynamicArticle.deletedSections = this.deletedSections;

      }
    }
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
    this.saveAsDraftMethod();
    this.dynamicArticle.status = 2;

    var response = new ResponseModel();
    this.articleService.updateArticle(this.dynamicArticle).subscribe(res => {
      response = res;
      if (response != null) {
        if (response.success) {
          this.articleService.updateArticleStatus(this.dynamicArticle).subscribe(res => {
            response = res;
            if (response != null) {
              if (response.success) {
                this.submitted = true;
                this.modalService.openModal(toastStatus.success, "Post Article", "Article is published.");
                this.router.navigate(['/articles/', this.dynamicArticle.slug]);
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
        else {
          this.modalService.openModal(toastStatus.danger, "Post Article", response.message);
        }
      }
      else {
        this.modalService.openModal(toastStatus.danger, "Post Article", "Error while publishing article.");
      }
    });
  }

  canceladdEditArticle() {

    if (!this.isOpenForEdt) {
      this.router.navigate(['/article/articles']);
    }
    else {
      this.router.navigate(['/article/articles']);
    }
  }

  loadArticleDetails(slug: string) {

    this.info_components.forEach(comp => {
      comp.component.instance._ref.destroy();
    });

    this.components.forEach(comp => {
      comp.component.instance._ref.destroy();
    });

    this.getArticleBySlug(slug);
    this.getArticleSectionsBySlug(slug);
    this.getArticleInfoCardBySlug(slug);

    console.log(this.allSections);

  }

  getArticleBySlug(slug: string) {
    this.articleService.getArticleBySlug(slug)
      .subscribe((data: any) => {
        this.article.id = data.id;
        this.article.title = data.title;
        this.article.user = data.user;
        this.article.category = data.category.split(',');;
        this.article.summary = data.summary;
        this.article.bannerimg = data.banner;
        this.bannerImage = data.banner;
        this.article.is_featured = data.is_featured == 1 ? true : false;
        this.article.is_active = data.is_active;
        this.article.created_at = data.created_at;
        this.article.slug = data.slug;
      });


  }

  getArticleSectionsBySlug(slug: string) {
    this.articleService.getArticleSectionsBySlug(slug)
      .subscribe((data: SectionItem[]) => {
        if (data != null) {
          data.map(sec => {
            let section: SectionItem = new SectionItem();
            section.id = sec.id;
            section.title = sec.title;
            section.status = sec.status;
            section.description = decodeURIComponent(sec.description);
            section.description = section.description.replace("[QUOTE]", '"');
            this.allSections.push(section);
            //this.addSectionComponent(this.addSectionComponentClass, section);
          });
        }
      });
  }

  addSectionComponent(componentClass: Type<AddSectionComponent>, section: SectionItem) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.container.createComponent(componentFactory);

    // Push the component so that we can keep track of which components are created
    var compItem = new ComponentItem();
    compItem.component = component;
    compItem.id = this.components.length == 0 ? 1 : Math.max.apply(Math, this.components.map(function (o) { return o.id; })) + 1;

    component.instance._ref = component;
    component.instance.section = section;
    component.instance.passDeleteEntry.subscribe((idEntry) => {
      this.deletedSections.push(idEntry);
    })
    this.components.push(compItem);
  }

  addInfoComponent(componentClass: Type<AddInfocardGroupComponent>) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.infocontainer.createComponent(componentFactory);

    // Push the component so that we can keep track of which components are created
    var compItem = new ComponentItem();
    compItem.component = component;
    compItem.id = this.info_components.length == 0 ? 1 : Math.max.apply(Math, this.info_components.map(function (o) { return o.id; })) + 1;
    component.instance._ref = component;
    component.instance._id = compItem.id;

    component.instance.passDeleteEntry.subscribe((idEntry) => {
      const index: number = this.info_components.findIndex(item => item.id == idEntry);
      if (index !== -1) {
        this.info_components.splice(index, 1);
      }
    })

    this.info_components.push(compItem);
  }

  getArticleInfoCardBySlug(slug: string) {
    this.articleService.getArticleInfoCardBySlug(slug)
      .subscribe((data: any) => {
        console.log("return info data " + data);

        let infocard = data.infocard.replace("[QUOTE]", "'");
        let infoGroupDetailList: InfoGroupDetailModal[] = JSON.parse(infocard);
        if (infoGroupDetailList != null) {
          infoGroupDetailList.map(sec => {
            this.addInfoCardComponent(this.addInfocardGroupComponent, sec);
          });
        }
      });
  }

  addInfoCardComponent(componentClass: Type<AddInfocardGroupComponent>, infoGroupDetailModal: InfoGroupDetailModal) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.infocontainer.createComponent(componentFactory);
    // Push the component so that we can keep track of which components are created
    var compItem = new ComponentItem();
    compItem.component = component;
    compItem.id = this.info_components.length == 0 ? 1 : Math.max.apply(Math, this.info_components.map(function (o) { return o.id; })) + 1;
    component.instance._ref = component;
    component.instance._id = compItem.id;
    component.instance.infoGroupDetailModal = infoGroupDetailModal;

    component.instance.passDeleteEntry.subscribe((idEntry) => {
      const index: number = this.info_components.findIndex(item => item.id == idEntry);
      if (index !== -1) {
        this.info_components.splice(index, 1);
      }
    })

    infoGroupDetailModal.infoDetailList.forEach(infoDetailModal => {
      component.instance.addInfocardComponent(component.instance.addInfocardModalComponent, infoDetailModal);
    });

    this.info_components.push(compItem);
  }

  addNewCategory(category_name: string) {
    this.loading = true;
    setTimeout(() => {
      var response = new ResponseModel();
      let categoryItem: CategoryItem = new CategoryItem();

      categoryItem.category_name = category_name;
      this.articleService.saveCategory(categoryItem).subscribe(res => {
        response = res;
        if (response != null) {
          if (response.success) {
            this.submitted = true;
            //resolve({ id: response.data, category_name, valid: true });
            this.articleService.getAllCategory().subscribe(result => {
              this.categories = [];
              this.categories = this.categories.concat(result);
            });
          }
          else {
            this.modalService.openModal(toastStatus.danger, "Add Category", response.message);
          }
        }
        else {
          this.modalService.openModal(toastStatus.danger, "Add Category", "Error while adding Category.");
        }
      });
      this.loading = false;
    }, 1000);

  }

  getArticleTemplatesList() {
    this.articleService.getArticleTemplatesList().subscribe(result => {
      this.templateList = [];
      this.templateList = this.templateList.concat(result);
    });
  }

  public onTemplateSelected(event) {
    const value = event.target.value;
    this.loadArticleDetails(this.selectedTemplate);
  }

  SectionsSorted(event) {
    console.log(event);
    this.allSections = event;
  }

  reorderSections() {
    let index: number = 1;

    this.allSections.forEach(sec => {
      sec.sortorder = index++;
    });
  }

  removeSection(id: any) {
    const index: number = this.allSections.findIndex(item => item.id == id);
    if (index !== -1) {
      this.allSections.splice(index, 1);
    }
    this.deletedSections.push(id);

    this.components.forEach(comp => {
      comp.component.instance._ref.destroy();
    });
  }

  SelectedSection(section: any) {

    this.components.forEach(comp => {
      comp.component.instance._ref.destroy();
    });
    this.addSectionComponent(this.addSectionComponentClass, section);
  }

  listStyle = {
    height: '600px',
    width: '100%',
    dropZoneHeight: '100px'
  }
}