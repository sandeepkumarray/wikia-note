import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ArticleService } from '../article/article.service';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    CarouselModule
  ]
})
export class HomeModule { }
