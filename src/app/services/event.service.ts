import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }

  /**
   * searchArticleTitle
   */
  public searchArticleTitleEvent: EventEmitter<any> = new EventEmitter();

  /**
   * onSearchArticleTitle
   */
  public onSearchArticleTitle(searchkey: string) {
    this.searchArticleTitleEvent.emit(searchkey);
  }
}
