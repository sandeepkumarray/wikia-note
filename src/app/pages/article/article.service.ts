import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { ArticleItem ,CategoryItem, ResponseModel, DynamicArticleData, SectionItem } from '../models/models.component';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient, private router: Router) { }

  getAllArticles(pageno: number, limit: number): Observable<ArticleItem[]> {

    let apiURL = `${environment.serverUrl}?procedureName=getAllArticles&pageno=` + pageno + `&limit=` + limit;

    if (isDevMode()) {
      apiURL = 'assets/data/articles.json';
      return this.http
        .get<ArticleItem[]>(apiURL)
        .pipe(
          map(news => news.splice(pageno, limit)),
          delay(1500),
        );
    }

    return this.http.get<ArticleItem[]>(apiURL);
  }

  getAllCategory(): Observable<CategoryItem[]> {

    let apiURL = `${environment.serverUrl}?procedureName=getAllCategories`;

    if (isDevMode()) {
      apiURL = 'assets/data/Categories.json';
    }
    return this.http.get<CategoryItem[]>(apiURL);
  }

  saveArticle(articleData: ArticleItem): Observable<ResponseModel> {

    let apiURL = `${environment.serverUrl}`;

    if (isDevMode()) {
      return null;
    }

    articleData.procedureName = "saveArticle";
    articleData.slug = articleData.title.replace(" ", "_");

    var articleJson = JSON.stringify(articleData);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.post<ResponseModel>(apiURL, { data: articleJson }, httpOptions);
  }

  getArticleDescTemplate() {
    var apiURL = 'assets/articleTemplate.html';
    return this.http.get(apiURL, { responseType: 'text' });
  }

  getTop6FeaturedArticles(): Observable<ArticleItem[]> {
    let apiURL = `${environment.serverUrl}?procedureName=getTop6FeaturedArticles`;
    if (isDevMode()) {
      apiURL = 'assets/data/featuredarticle.json';
    }

    return this.http.get<ArticleItem[]>(apiURL);
  }

  saveArticleAsDraft(articleData: DynamicArticleData): Observable<ResponseModel> {

    let apiURL = `${environment.serverUrl}`;

    if (isDevMode()) {
      return null;
    }

    articleData.procedureName = "saveArticleAsDraft";
    
    var articleJson = JSON.stringify(articleData);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.post<ResponseModel>(apiURL, { data: articleJson }, httpOptions);
  }

  saveCategory(category: CategoryItem): Observable<ResponseModel> {

    let apiURL = `${environment.serverUrl}`;

    if (isDevMode()) {
      return null;
    }

    category.procedureName = "saveArticle";
    var categoryJson = JSON.stringify(category);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.post<ResponseModel>(apiURL, { data: categoryJson }, httpOptions);
  }

  getArticleBySlug(slug: string): Observable<ArticleItem>  {
    let apiURL = `${environment.serverUrl}?procedureName=getArticleBySlug&slug=` + slug;
    if (isDevMode()) {
      apiURL = 'assets/data/article.json';
    }
    return this.http.get<ArticleItem>(apiURL);
  }

  getArticleSectionsBySlug(slug: string): Observable<SectionItem[]>  {
    let apiURL = `${environment.serverUrl}?procedureName=getArticleSectionsBySlug&slug=` + slug;
    if (isDevMode()) {
      
    }
    return this.http.get<SectionItem[]>(apiURL);
  }
  
  updateArticle(articleData: DynamicArticleData): Observable<ResponseModel> {

    let apiURL = `${environment.serverUrl}`;

    if (isDevMode()) {
      return null;
    }

    articleData.procedureName = "updateArticle";
    
    var articleJson = JSON.stringify(articleData);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.post<ResponseModel>(apiURL, { data: articleJson }, httpOptions);
  }
    
  updateArticleStatus(articleData: DynamicArticleData): Observable<ResponseModel> {

    let apiURL = `${environment.serverUrl}`;

    if (isDevMode()) {
      return null;
    }

    articleData.procedureName = "updateArticleStatus";
    
    var articleJson = JSON.stringify(articleData);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.post<ResponseModel>(apiURL, { data: articleJson }, httpOptions);
  }
}