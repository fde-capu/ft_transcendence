import { ComponentFixture, TestBed } from '@angular/core/testing';

import { U2uActionsComponent } from './u2u-actions.component';

describe('U2uActionsComponent', () => {
  let component: U2uActionsComponent;
  let fixture: ComponentFixture<U2uActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ U2uActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(U2uActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
