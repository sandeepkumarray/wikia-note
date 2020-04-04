import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInfocardModalComponent } from './add-infocard-modal.component';

describe('AddInfocardModalComponent', () => {
  let component: AddInfocardModalComponent;
  let fixture: ComponentFixture<AddInfocardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInfocardModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInfocardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
