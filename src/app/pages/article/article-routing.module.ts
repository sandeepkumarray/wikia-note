import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticleComponent } from './article.component';
import { AddArticleComponent } from './add-article/add-article.component';
import { ArticleViewComponent } from './article-view/article-view.component';

import { ArticleInfiListComponent } from './article-infi-list/article-infi-list.component';

const routes: Routes = [{
    path: '',
    component: ArticleComponent,
    children: [
      {
        path: 'articles',
        component: ArticleInfiListComponent,
      }, 
      {
        path: 'search/:searchkey',
        component: ArticleInfiListComponent,
      },
      {
        path: 'add-article',
        component: AddArticleComponent,
      },
      {
        path: 'add-template',
        component: AddArticleComponent,
      },
      {
        path: 'article-view/:slug',
        component: ArticleViewComponent,
      },
      {
        path: 'edit-article/:slug',
        component: AddArticleComponent,
      },
    ],
  }];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class ArticleRoutingModule {
  }
  