import { Component, OnInit } from '@angular/core';

import { ArticleService } from '../article.service';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-article-infi-list',
  templateUrl: './article-infi-list.component.html',
  styleUrls: ['./article-infi-list.component.css']
})
export class ArticleInfiListComponent implements OnInit {

  Card = {
    articles: [],
    placeholders: [],
    loading: false,
    pageToLoadNext: 1,
  };
  pageSize = 10;

  array = [];
  sum = 100;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  modalOpen = false;
  search_key: string;
  noresult: boolean;

  constructor(private activatedRoute: ActivatedRoute, private articleService: ArticleService, public eventService: EventService) {
    this.appendItems(0, this.sum);
    this.search_key = this.activatedRoute.snapshot.paramMap.get('searchkey');

    if (this.search_key != null) {
      this.onScrollDown(null);
    }
  }

  ngOnInit() {
    this.noresult = false;
    this.onScrollDown(null);
    this.eventService.searchArticleTitleEvent.subscribe(searchkey => {
      this.search_key = searchkey;
      this.Card.articles = [];
      this.Card.pageToLoadNext = 1;
      this.onScrollDown(null);
    });
  }

  loadNext(cardData) {
    if (cardData.loading) { return; }

    cardData.loading = true;
    cardData.placeholders = new Array(this.pageSize);

    if (this.search_key != null) {
      this.articleService.searchArticles(cardData.pageToLoadNext, this.pageSize, this.search_key)
        .subscribe(nextarticles => {

          if (nextarticles == undefined){
            this.noresult = true;
          }
          cardData.placeholders = [];
          cardData.articles.push(...nextarticles);
          cardData.loading = false;
          cardData.pageToLoadNext++;
        });

    }
    else {
      this.articleService.getAllArticles(cardData.pageToLoadNext, this.pageSize)
        .subscribe(nextarticles => {
          if (nextarticles == null)
            this.noresult = false;

          cardData.placeholders = [];
          cardData.articles.push(...nextarticles);
          cardData.loading = false;
          cardData.pageToLoadNext++;
        });
    }
  }

  onScrollUp() {
  }

  addItems(startIndex, endIndex, _method) {
    for (let i = 0; i < this.sum; ++i) {
      this.array[_method]([i, ' ', this.generateWord()].join(''));
    }
  }

  appendItems(startIndex, endIndex) {
    this.addItems(startIndex, endIndex, 'push');
  }

  prependItems(startIndex, endIndex) {
    this.addItems(startIndex, endIndex, 'unshift');
  }

  onScrollDown(ev) {
    // // add another 20 items
    // const start = this.sum;
    // this.sum += 20;
    // this.appendItems(start, this.sum);
    this.loadNext(this.Card);
    this.direction = 'down'
  }

  onUp(ev) {
    const start = this.sum;
    this.sum += 20;
    this.prependItems(start, this.sum);

    this.direction = 'up';
  }

  generateWord() {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    const lengthOfCode = 40;
    return this.makeRandom(lengthOfCode, possible);
  }

  makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}