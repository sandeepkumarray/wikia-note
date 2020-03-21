import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleItemPlaceholdersComponent } from './article-item-placeholders.component';

describe('ArticleItemPlaceholdersComponent', () => {
  let component: ArticleItemPlaceholdersComponent;
  let fixture: ComponentFixture<ArticleItemPlaceholdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleItemPlaceholdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleItemPlaceholdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
