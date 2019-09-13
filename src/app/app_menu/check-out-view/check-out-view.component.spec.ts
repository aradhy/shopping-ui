import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOutViewComponent } from './check-out-view.component';

describe('CheckOutViewComponent', () => {
  let component: CheckOutViewComponent;
  let fixture: ComponentFixture<CheckOutViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOutViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOutViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
