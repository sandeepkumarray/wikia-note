import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleComponent } from './article.component';
import { AddArticleComponent } from './add-article/add-article.component';
import { ArticleViewComponent } from './article-view/article-view.component';
import { AddSectionComponent } from './add-article/add-section/add-section.component';

import { ArticleRoutingModule } from './article-routing.module';
import { ArticleInfiListComponent } from './article-infi-list/article-infi-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSummernoteDirective, NgxSummernoteModule, NgxSummernoteViewDirective } from 'ngx-summernote';

import { UiSwitchModule } from 'ngx-toggle-switch';
import { ArticleItemComponent } from './article-infi-list/article-item/article-item.component';
import { ArticleItemPlaceholdersComponent } from './article-infi-list/article-item-placeholders/article-item-placeholders.component';
import { SectionViewComponent } from './article-view/section-view/section-view.component';

@NgModule({
  declarations: [
    ArticleComponent,
     AddArticleComponent, 
     ArticleViewComponent, 
     AddSectionComponent, 
     ArticleInfiListComponent, 
     ArticleItemComponent, 
     ArticleItemPlaceholdersComponent, SectionViewComponent
    ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgxSummernoteModule,
    UiSwitchModule,
  ],
  providers: [
  ],
  entryComponents: [AddSectionComponent]
})
export class ArticleModule { }
