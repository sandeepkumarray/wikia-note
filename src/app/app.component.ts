import { Component, Output, EventEmitter } from '@angular/core';

import { ToastService } from './services/toast.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ArticleInfiListComponent } from './pages/article/article-infi-list/article-infi-list.component';
import { Router, NavigationEnd } from '@angular/router';
import { EventService } from './services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wikia-note';
  bg_image = "assets/images/bg2.jpg";
  search_key: string;

  navbarCollapseClass: string = "navbar-collapse collapse";

  bgIndex = 1;
  bg_image_container: any[] = [
    'bg1.jpg',
    'bg2.jpg',
    'bg3.jpg',
    'bg4.jpg',
    'bg5.jpg',
  ];

  constructor(private router: Router, public toastService: ToastService, public eventService: EventService) {
    this.bgIndex = Math.floor(Math.random() * this.bg_image_container.length);
    this.bg_image = "assets/images/" + this.bg_image_container[this.bgIndex];

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  });
  }

  searchKeydown(event) {
    if (event.key === "Enter") {
      if (this.router.url.includes('/article/search/')) {
        this.eventService.onSearchArticleTitle(this.search_key);
      }
      else {
        this.router.navigate(['/article/search/', this.search_key]);
      }
    }
  }

  navMenuHideShow() {
    if (this.navbarCollapseClass == "navbar-collapse collapse") {

      this.navbarCollapseClass = "navbar-collapse collapse show";
    }
    else {
      this.navbarCollapseClass = "navbar-collapse collapse";
    }
  }
}
