import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/miscellaneous/not-found/not-found.component';

import { ArticleViewComponent } from './pages/article/article-view/article-view.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'article',
    loadChildren: () => import('./pages/article/article.module')
      .then(m => m.ArticleModule),
  },
  {
    path: 'article/:slug',
    component: ArticleViewComponent,
  },
  {
    path: 'miscellaneous',
    loadChildren: () => import('./pages/miscellaneous/miscellaneous.module')
      .then(m => m.MiscellaneousModule),
  },
  {
    path: ':slug',
    component: ArticleViewComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
