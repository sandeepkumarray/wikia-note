import { Component, OnInit, Input } from '@angular/core';

import { Router } from '@angular/router';
import { ArticleItem } from '../../../models/models.component';

@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.css']
})
export class ArticleItemComponent implements OnInit {

  @Input() article: ArticleItem;
  constructor(private router: Router) {

  }

  ngOnInit() {
  }

  gotoDetails(articleslug: any) {
    this.router.navigate(['/article/article-view/', articleslug]);
  }
}
