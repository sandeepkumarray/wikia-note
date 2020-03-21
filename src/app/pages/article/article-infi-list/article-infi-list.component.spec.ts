import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleInfiListComponent } from './article-infi-list.component';

describe('ArticleInfiListComponent', () => {
  let component: ArticleInfiListComponent;
  let fixture: ComponentFixture<ArticleInfiListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleInfiListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleInfiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
