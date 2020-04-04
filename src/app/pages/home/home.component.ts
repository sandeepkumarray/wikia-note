import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { Router } from '@angular/router';
import { ArticleService } from '../article/article.service';

import { ArticleItem } from '../models/models.component';


import { SlidesOutputData, OwlOptions } from 'ngx-owl-carousel-o';
export class CarouselData {
  id?: string;
  text: string;
  dataMerge?: number;
  width?: number;
  dotContent?: string;
  src?: string;
  dataHash?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private alive = true;
  statusCards: string;

  constructor(private articleService: ArticleService, private router: Router)
  {
  }

  ngOnInit() {
    this.articleService.getTop6FeaturedArticles().
      subscribe(result => {
        this.articlesdata = (result);
      });
  }

  
  customOptions: OwlOptions = {
    autoWidth: true,
    loop: true,
    // items: '10',
    // margin: 10,
    // slideBy: 'page',
    // merge: true,
    // autoplay: true,
    // autoplayTimeout: 5000,
    // autoplayHoverPause: true,
		// autoplaySpeed: 4000,
    dotsSpeed: 500,
    // dots: false,
    // dotsData: true,
    // mouseDrag: false,
    // touchDrag: false,
    // pullDrag: false,
    smartSpeed: 400,
    // fluidSpeed: 499,
    dragEndSpeed: 350,
    // dotsEach: 4,
    // center: true,
    // rewind: true,
    // rtl: true,
    // startPosition: 1,
    // navText: [ '<i class=fa-chevron-left>left</i>', '<i class=fa-chevron-right>right</i>' ],
    // stagePadding: 40,
    nav: false
  }


  carouselData: CarouselData[] = [
    { id: 'slide-1', text: 'Slide 1 HM', dataMerge: 2, width: 300, dotContent: 'text1'},
    { id: 'slide-2', text: 'Slide 2 HM', dataMerge: 1, width: 500, dotContent: 'text2'},
    { id: 'slide-3', text: 'Slide 3 HM', dataMerge: 3, dotContent: 'text3'},
    { id: 'slide-4', text: 'Slide 4 HM', width: 450, dotContent: 'text4'},
    { id: 'slide-5', text: 'Slide 5 HM', dataMerge: 2, dotContent: 'text5'},
    // { text: 'Slide 6', dotContent: 'text5'},
    // { text: 'Slide 7', dotContent: 'text5'},
    // { text: 'Slide 8', dotContent: 'text5'},
    // { text: 'Slide 9', dotContent: 'text5'},
    // { text: 'Slide 10', dotContent: 'text5'},
  ];

  articlesdata: ArticleItem[] = [];

  ngOnDestroy() {
    this.alive = false;
  }

  gotoDetails(articleslug: any) {
    this.router.navigate(['/articles/', articleslug]);
  }

}
