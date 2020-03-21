import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

import { ArticleItem, SectionItem } from '../../models/models.component';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.css']
})

export class ArticleViewComponent implements OnInit {

  @Input() article: ArticleItem;
  slug: any;

  constructor(private articleService: ArticleService, private activatedRoute: ActivatedRoute,
    private http: HttpClient, private router: Router) {
    this.article = new ArticleItem();
    this.slug = this.activatedRoute.snapshot.paramMap.get('slug');
  }

  ngOnInit() {
    this.getArticleDetails(this.slug);
  }

  getArticleDetails(slug: string) {
    this.article.sections = [];

    this.articleService.getArticleBySlug(slug).subscribe((data: any) => {
      console.log(data);
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
            data.map(sec => {
              console.log(sec);
              let section: SectionItem = new SectionItem();
              section.id = sec.id;
              section.title = sec.title;
              section.status = sec.status;
              section.description = atob(sec.description);
              this.article.sections.push(section)
            });
          });
      }
      else {
        this.articleService.getArticleBySlug("Not_Found").subscribe((data: any) => {
          this.article.id = "0";
          this.article.title = slug;
          this.article.user = null;

          this.articleService.getArticleSectionsBySlug("Not_Found")
            .subscribe((data: SectionItem[]) => {
              data.map(sec => {
                console.log(sec);
                let section: SectionItem = new SectionItem();
                section.id = sec.id;
                section.title = slug;
                section.status = sec.status;
                section.description = atob(sec.description);
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

}
