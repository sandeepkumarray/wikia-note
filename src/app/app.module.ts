import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { HomeModule } from './pages/home/home.module';
import { MiscellaneousModule } from './pages/miscellaneous/miscellaneous.module';
import { ArticleModule } from './pages/article/article.module';

import { NgbModule, NgbTab, NgbTabset  } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './pages/theme/toast/toast.component';
import { ModalComponent } from './pages/theme/modal/modal.component';
import { ModelsComponent } from './pages/models/models.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailLinkComponent } from './pages/article/add-article/detail-link/detail-link.component';
import { NgxSortableModule } from 'ngx-sortable';

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent,
    ModalComponent,
    ModelsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CarouselModule,
    HomeModule,
    MiscellaneousModule,
    ArticleModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSortableModule,
  ],
  providers: [],
  entryComponents: [ModalComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
