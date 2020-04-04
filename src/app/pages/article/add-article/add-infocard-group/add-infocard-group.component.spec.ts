import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInfocardGroupComponent } from './add-infocard-group.component';

describe('AddInfocardGroupComponent', () => {
  let component: AddInfocardGroupComponent;
  let fixture: ComponentFixture<AddInfocardGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInfocardGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInfocardGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
